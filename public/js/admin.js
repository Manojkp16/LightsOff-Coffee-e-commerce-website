// ==========================================================================
// BeanCraft Admin Dashboard Controller
// ==========================================================================

const AdminController = {
  activeTab: 'orders',

  async init() {
    this.checkAdminAccess();
    this.bindTabs();
    this.bindEvents();
    await this.loadStats();
    await this.loadOrders();
    await this.loadProducts();
  },

  checkAdminAccess() {
    const banner = document.querySelector('#adminAuthBanner');
    const content = document.querySelector('#adminMainContent');

    if (!AuthManager.isAdmin()) {
      if (banner) banner.style.display = 'block';
      if (content) content.style.display = 'none';
    } else {
      if (banner) banner.style.display = 'none';
      if (content) content.style.display = 'block';
    }
  },

  async loginDemoAdmin() {
    await AuthManager.login('admin@beancraft.com', 'adminpassword123');
    this.checkAdminAccess();
    await this.loadStats();
    await this.loadOrders();
    await this.loadProducts();
  },

  bindTabs() {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.querySelector(`#adminPanel-${target}`)?.classList.add('active');
        this.activeTab = target;
      });
    });
  },

  bindEvents() {
    // Add product button opens modal
    document.querySelector('#btnOpenAddProduct')?.addEventListener('click', () => {
      document.querySelector('#addProductModal')?.classList.add('open');
    });

    // Close product modal
    document.querySelector('#btnCloseProductModal')?.addEventListener('click', () => {
      document.querySelector('#addProductModal')?.classList.remove('open');
    });

    // Add Product Form Submit
    document.querySelector('#addProductForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleAddProduct();
    });

    // Reseed DB Button
    document.querySelector('#btnReseedDb')?.addEventListener('click', async () => {
      if (confirm('Reset database to default artisan coffee collection?')) {
        try {
          await API.post('/admin/seed-reset', {});
          showToast('Database reset successfully!', 'success');
          await this.loadStats();
          await this.loadOrders();
          await this.loadProducts();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });

    // Order status filter dropdown
    document.querySelector('#adminOrderStatusFilter')?.addEventListener('change', (e) => {
      this.loadOrders(e.target.value);
    });
  },

  async loadStats() {
    try {
      const res = await API.get('/admin/stats');
      const stats = res.stats;
      document.querySelector('#statRevenue').textContent = formatPrice(stats.totalRevenue);
      document.querySelector('#statOrders').textContent = stats.totalOrders;
      document.querySelector('#statProducts').textContent = stats.totalProducts;
      document.querySelector('#statUsers').textContent = stats.totalUsers;
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    }
  },

  async loadOrders(status = 'All') {
    const tbody = document.querySelector('#adminOrdersTableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">Loading orders...</td></tr>`;

    try {
      const query = status && status !== 'All' ? `?status=${status}` : '';
      const res = await API.get(`/admin/orders${query}`);
      const orders = res.data || [];

      if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">No orders found.</td></tr>`;
        return;
      }

      tbody.innerHTML = orders.map(o => `
        <tr>
          <td><strong style="color:var(--primary-espresso);">${o.orderNumber}</strong><br><small style="color:var(--text-muted); font-family:monospace;">${o.trackingNumber}</small></td>
          <td>${new Date(o.createdAt).toLocaleDateString()}</td>
          <td>
            <strong>${o.customerInfo.name}</strong><br>
            <small style="color:var(--text-muted);">${o.customerInfo.email}</small>
          </td>
          <td>${o.orderItems.length} item(s)</td>
          <td><strong>${formatPrice(o.totalAmount)}</strong></td>
          <td>
            <select class="sort-select" style="padding:6px 10px; font-size:0.82rem;" onchange="AdminController.updateOrderStatus('${o._id}', this.value)">
              <option value="Placed" ${o.orderStatus === 'Placed' ? 'selected' : ''}>Placed</option>
              <option value="Roasting" ${o.orderStatus === 'Roasting' ? 'selected' : ''}>Roasting</option>
              <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <a href="/orders?orderNumber=${o.orderNumber}" target="_blank" class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:0.75rem;">View</a>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#dc2626;">Error loading orders.</td></tr>`;
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      showToast(`Order status updated to "${newStatus}"`, 'success');
      this.loadStats();
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  async loadProducts() {
    const tbody = document.querySelector('#adminProductsTableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">Loading coffee catalog...</td></tr>`;

    try {
      const res = await API.get('/products');
      const products = res.data || [];

      tbody.innerHTML = products.map(p => `
        <tr>
          <td><img src="${p.primaryImage}" class="table-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=100&q=80'"></td>
          <td>
            <strong>${p.name}</strong><br>
            <small style="color:var(--text-muted);">${p.origin || p.category}</small>
          </td>
          <td><span class="tasting-pill" style="font-size:0.75rem;">${p.category}</span></td>
          <td>${p.roastLevel} (${p.roastMeter || 3}/5)</td>
          <td><strong>${formatPrice(p.price)}</strong></td>
          <td>${p.stock}</td>
          <td>
            <div class="action-btn-group">
              <a href="/product/${p._id}" target="_blank" class="action-btn-icon" title="View in Store">👁</a>
              <button class="action-btn-icon delete" title="Delete Product" onclick="AdminController.deleteProduct('${p._id}', '${p.name}')">🗑</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#dc2626;">Error loading products.</td></tr>`;
    }
  },

  async handleAddProduct() {
    try {
      const name = document.querySelector('#newProdName').value;
      const subtitle = document.querySelector('#newProdSubtitle').value;
      const description = document.querySelector('#newProdDesc').value;
      const category = document.querySelector('#newProdCategory').value;
      const roastLevel = document.querySelector('#newProdRoast').value;
      const roastMeter = parseInt(document.querySelector('#newProdRoastMeter').value) || 3;
      const price = parseFloat(document.querySelector('#newProdPrice').value);
      const stock = parseInt(document.querySelector('#newProdStock').value) || 50;
      const origin = document.querySelector('#newProdOrigin').value || 'Artisan Farm';
      const flavorNotesStr = document.querySelector('#newProdFlavors').value;
      const flavorNotes = flavorNotesStr.split(',').map(s => s.trim()).filter(Boolean);
      const primaryImage = document.querySelector('#newProdImage').value || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80';

      const payload = {
        name,
        subtitle,
        description,
        category,
        roastLevel,
        roastMeter,
        price,
        stock,
        origin,
        flavorNotes,
        primaryImage,
        sizes: [
          { size: "250g", priceMultiplier: 1.0 },
          { size: "500g", priceMultiplier: 1.85 },
          { size: "1kg", priceMultiplier: 3.4 }
        ],
        grindOptions: [
          "Whole Bean",
          "Coarse (French Press / Cold Brew)",
          "Medium (Drip / Chemex)",
          "Fine (Espresso / Moka Pot)"
        ]
      };

      await API.post('/products', payload);
      showToast(`Added new coffee "${name}"!`, 'success');
      document.querySelector('#addProductModal').classList.remove('open');
      document.querySelector('#addProductForm').reset();
      await this.loadProducts();
      await this.loadStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  },

  async deleteProduct(id, name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        showToast(`Deleted "${name}"`, 'normal');
        await this.loadProducts();
        await this.loadStats();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminController.init();
});
