// ==========================================================================
// BeanCraft Checkout & Payment Controller
// ==========================================================================

const CheckoutController = {
  appliedPromo: null,

  init() {
    const items = CartManager.getItems();
    if (items.length === 0) {
      window.location.href = '/cart';
      return;
    }

    this.autoFillUserData();
    this.renderOrderSummary();
    this.bindEvents();
  },

  autoFillUserData() {
    const user = AuthManager.getUser();
    if (!user) return;

    if (user.name) document.querySelector('#custName').value = user.name;
    if (user.email) document.querySelector('#custEmail').value = user.email;
    if (user.phone) document.querySelector('#custPhone').value = user.phone;

    if (user.address) {
      if (user.address.street) document.querySelector('#custStreet').value = user.address.street;
      if (user.address.city) document.querySelector('#custCity').value = user.address.city;
      if (user.address.state) document.querySelector('#custState').value = user.address.state;
      if (user.address.zipCode) document.querySelector('#custZip').value = user.address.zipCode;
    }
  },

  renderOrderSummary() {
    const container = document.querySelector('#checkoutItemsList');
    if (!container) return;

    const items = CartManager.getItems();
    const subtotal = CartManager.getSubtotal();

    // Line items list
    container.innerHTML = items.map(item => `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.9rem;">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${item.image}" alt="${item.name}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
          <div>
            <div style="font-weight:700; color:var(--primary-espresso);">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${item.size} • ${item.grind} × ${item.quantity}</div>
          </div>
        </div>
        <div style="font-weight:700;">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');

    // Shipping logic
    let shippingCost = subtotal >= 40 ? 0 : 5.00;
    let discount = 0;

    if (this.appliedPromo === 'COFFEE10') {
      discount = Math.round(subtotal * 0.10 * 100) / 100;
    } else if (this.appliedPromo === 'BEAN20') {
      discount = Math.round(subtotal * 0.20 * 100) / 100;
    } else if (this.appliedPromo === 'FREESHIP') {
      shippingCost = 0;
    }

    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
    const grandTotal = Math.max(0, Math.round((subtotal - discount + shippingCost + tax) * 100) / 100);

    document.querySelector('#summarySubtotal').textContent = formatPrice(subtotal);
    document.querySelector('#summaryDiscount').textContent = `-${formatPrice(discount)}`;
    document.querySelector('#discountRow').style.display = discount > 0 ? 'flex' : 'none';
    document.querySelector('#summaryShipping').textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost);
    document.querySelector('#summaryTax').textContent = formatPrice(tax);
    document.querySelector('#summaryTotal').textContent = formatPrice(grandTotal);
  },

  bindEvents() {
    // Promo code apply
    const promoForm = document.querySelector('#promoCodeForm');
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.querySelector('#promoInput').value.trim().toUpperCase();
        if (['COFFEE10', 'BEAN20', 'FREESHIP'].includes(code)) {
          this.appliedPromo = code;
          showToast(`Promo "${code}" applied successfully!`, 'success');
          this.renderOrderSummary();
        } else {
          showToast('Invalid promo code. Try COFFEE10', 'error');
        }
      });
    }

    // Payment method switch
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const method = e.target.value;
        const cardBox = document.querySelector('#cardDetailsBox');
        const upiBox = document.querySelector('#upiDetailsBox');
        if (cardBox) cardBox.style.display = method === 'Card' ? 'block' : 'none';
        if (upiBox) upiBox.style.display = method === 'UPI' ? 'block' : 'none';
      });
    });

    // Checkout Form Submit
    const form = document.querySelector('#checkoutForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handlePlaceOrder();
      });
    }
  },

  async handlePlaceOrder() {
    const btn = document.querySelector('#btnPlaceOrder');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Roasting & Processing Order...';
    }

    try {
      const items = CartManager.getItems();
      const customerInfo = {
        name: document.querySelector('#custName').value,
        email: document.querySelector('#custEmail').value,
        phone: document.querySelector('#custPhone').value,
        address: {
          street: document.querySelector('#custStreet').value,
          city: document.querySelector('#custCity').value,
          state: document.querySelector('#custState').value,
          zipCode: document.querySelector('#custZip').value,
          country: 'USA'
        }
      };

      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Card';
      const notes = document.querySelector('#orderNotes')?.value || '';

      const payload = {
        customerInfo,
        orderItems: items,
        paymentMethod,
        promoCode: this.appliedPromo,
        notes
      };

      const res = await API.post('/orders', payload);
      CartManager.clearCart();

      // Show confirmation dialog or redirect
      showToast('Order confirmed! Fresh beans are on their way.', 'success');
      setTimeout(() => {
        window.location.href = `/orders?orderNumber=${res.data.orderNumber}`;
      }, 1000);
    } catch (error) {
      showToast(error.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Complete Order';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CheckoutController.init();
});
