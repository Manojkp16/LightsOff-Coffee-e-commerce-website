// ==========================================================================
// BeanCraft Order Tracking & History Controller
// ==========================================================================

const OrdersController = {
  async init() {
    this.bindSearchForm();

    // Check query params for auto-tracking
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get('orderNumber');
    if (orderNumber) {
      const input = document.querySelector('#trackOrderInput');
      if (input) input.value = orderNumber;
      await this.trackOrder(orderNumber);
    }

    // Load account orders if logged in
    if (AuthManager.isLoggedIn()) {
      await this.loadMyOrders();
    }
  },

  bindSearchForm() {
    const form = document.querySelector('#trackOrderForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.querySelector('#trackOrderInput').value.trim();
        if (query) {
          await this.trackOrder(query);
        }
      });
    }
  },

  async trackOrder(identifier) {
    const resultContainer = document.querySelector('#trackResultContainer');
    if (!resultContainer) return;

    resultContainer.innerHTML = `<p style="text-align:center; padding:30px;">Locating your fresh roast package...</p>`;
    resultContainer.style.display = 'block';

    try {
      const res = await API.get(`/orders/track/${encodeURIComponent(identifier)}`);
      const order = res.data;
      this.renderTrackingCard(order, resultContainer);
    } catch (error) {
      resultContainer.innerHTML = `
        <div style="background:#fee2e2; border:1px solid #fca5a5; padding:20px; border-radius:12px; color:#991b1b; text-align:center;">
          <h4>Order Not Found</h4>
          <p style="margin-top:6px; font-size:0.9rem;">We couldn't locate an order matching "${identifier}". Check your order confirmation email or enter a valid tracking number.</p>
        </div>
      `;
    }
  },

  renderTrackingCard(order, container) {
    const statuses = ['Placed', 'Roasting', 'Shipped', 'Delivered'];
    const currentIdx = statuses.indexOf(order.orderStatus);

    const stepsHtml = statuses.map((st, idx) => {
      const isCompleted = currentIdx >= idx;
      const isCurrent = currentIdx === idx;
      return `
        <div style="flex:1; text-align:center; position:relative;">
          <div style="width:36px; height:36px; border-radius:50%; margin:0 auto 8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem; background:${isCompleted ? 'var(--accent-caramel)' : '#e8ded2'}; color:${isCompleted ? '#fff' : 'var(--text-muted)'}; box-shadow:${isCurrent ? '0 0 0 4px rgba(196,123,71,0.2)' : 'none'};">
            ${isCompleted ? '✓' : idx + 1}
          </div>
          <div style="font-size:0.85rem; font-weight:${isCurrent ? '700' : '500'}; color:${isCompleted ? 'var(--primary-espresso)' : 'var(--text-muted)'};">
            ${st}
          </div>
        </div>
      `;
    }).join('');

    const itemsHtml = (order.orderItems || []).map(item => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--surface-border);">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">
          <div>
            <div style="font-weight:700; color:var(--primary-espresso);">${item.name}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${item.size} • ${item.grind} • Qty: ${item.quantity}</div>
          </div>
        </div>
        <div style="font-weight:700; color:var(--primary-espresso);">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="background:var(--surface-white); border:1px solid var(--surface-border); border-radius:16px; padding:32px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; border-bottom:1px solid var(--surface-border); padding-bottom:20px; margin-bottom:24px;">
          <div>
            <span style="font-size:0.8rem; text-transform:uppercase; font-weight:700; color:var(--accent-caramel);">Order Verified</span>
            <h3 style="font-size:1.6rem; margin:4px 0;">Order #${order.orderNumber}</h3>
            <div style="font-size:0.85rem; color:var(--text-muted);">Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.8rem; color:var(--text-muted);">Tracking Number:</div>
            <div style="font-weight:700; font-family:monospace; font-size:1rem; color:var(--primary-espresso);">${order.trackingNumber}</div>
            <span class="status-badge status-${order.orderStatus}" style="margin-top:6px;">${order.orderStatus}</span>
          </div>
        </div>

        <!-- Stepper Progress Bar -->
        <div style="margin:36px 0; display:flex; justify-content:space-between; position:relative;">
          ${stepsHtml}
        </div>

        <!-- Delivery & Customer Info -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; background:var(--accent-cream); padding:20px; border-radius:12px; margin-bottom:24px;">
          <div>
            <strong style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:6px;">Shipping Address</strong>
            <div style="font-weight:600; font-size:0.95rem;">${order.customerInfo.name}</div>
            <div style="font-size:0.9rem; color:var(--text-body);">${order.customerInfo.address.street}</div>
            <div style="font-size:0.9rem; color:var(--text-body);">${order.customerInfo.address.city}, ${order.customerInfo.address.state} ${order.customerInfo.address.zipCode}</div>
          </div>
          <div>
            <strong style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:6px;">Payment Method</strong>
            <div style="font-weight:600; font-size:0.95rem;">${order.paymentMethod}</div>
            <div style="font-size:0.9rem; color:var(--text-body);">Status: ${order.paymentStatus}</div>
            ${order.promoCode ? `<div style="font-size:0.85rem; color:var(--color-success); font-weight:600; margin-top:4px;">Promo: ${order.promoCode} applied</div>` : ''}
          </div>
        </div>

        <!-- Ordered Items -->
        <h4 style="margin-bottom:12px; font-size:1.1rem;">Roaster Parcel Contents</h4>
        <div>${itemsHtml}</div>

        <!-- Order Totals -->
        <div style="margin-top:20px; max-width:280px; margin-left:auto;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem;">
            <span>Subtotal:</span><span>${formatPrice(order.subtotal)}</span>
          </div>
          ${order.discount ? `
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem; color:var(--color-success);">
              <span>Discount:</span><span>-${formatPrice(order.discount)}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem;">
            <span>Shipping:</span><span>${order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem;">
            <span>Tax:</span><span>${formatPrice(order.tax)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.2rem; border-top:1px solid var(--surface-border); padding-top:8px; color:var(--primary-espresso);">
            <span>Total:</span><span>${formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    `;
  },

  async loadMyOrders() {
    const section = document.querySelector('#myOrdersSection');
    const list = document.querySelector('#myOrdersList');
    if (!section || !list) return;

    try {
      const res = await API.get('/orders/my-orders');
      const orders = res.data || [];

      if (orders.length > 0) {
        section.style.display = 'block';
        list.innerHTML = orders.map(o => `
          <div style="background:var(--surface-white); border:1px solid var(--surface-border); border-radius:12px; padding:20px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div>
              <div style="font-weight:700; font-size:1.05rem; color:var(--primary-espresso);">Order #${o.orderNumber}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${new Date(o.createdAt).toLocaleDateString()} • ${o.orderItems.length} item(s)</div>
              <div style="font-weight:700; margin-top:4px;">${formatPrice(o.totalAmount)}</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="status-badge status-${o.orderStatus}">${o.orderStatus}</span>
              <button class="btn btn-secondary btn-sm" onclick="OrdersController.trackOrder('${o.orderNumber}')">Track</button>
            </div>
          </div>
        `).join('');
      }
    } catch (e) {
      console.error('Failed to load user orders:', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OrdersController.init();
});
