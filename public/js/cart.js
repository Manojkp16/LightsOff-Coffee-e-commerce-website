// ==========================================================================
// BeanCraft Shopping Cart Management
// ==========================================================================

const CartManager = {
  storageKey: 'beancraft_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.updateBadges();
    this.renderDrawer();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items } }));
  },

  addItem(product, size = '250g', grind = 'Whole Bean', quantity = 1) {
    const items = this.getItems();
    quantity = parseInt(quantity) || 1;

    // Check size multiplier
    let sizeMultiplier = 1;
    if (product.sizes && product.sizes.length > 0) {
      const foundSize = product.sizes.find(s => s.size === size);
      if (foundSize) sizeMultiplier = foundSize.priceMultiplier;
    }

    const calculatedPrice = Math.round(product.price * sizeMultiplier * 100) / 100;

    // Existing item check
    const existingIndex = items.findIndex(
      item => item.productId === (product._id || product.id) && item.size === size && item.grind === grind
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId: product._id || product.id,
        name: product.name,
        price: calculatedPrice,
        image: product.primaryImage,
        size,
        grind,
        quantity
      });
    }

    this.saveItems(items);
    showToast(`Added "${product.name}" to cart!`, 'success');
  },

  updateQuantity(index, newQty) {
    const items = this.getItems();
    newQty = parseInt(newQty);
    if (newQty <= 0) {
      this.removeItem(index);
      return;
    }
    if (items[index]) {
      items[index].quantity = newQty;
      this.saveItems(items);
    }
  },

  removeItem(index) {
    const items = this.getItems();
    if (items[index]) {
      const removed = items.splice(index, 1);
      this.saveItems(items);
      showToast(`Removed "${removed[0]?.name}" from cart`, 'normal');
    }
  },

  clearCart() {
    localStorage.removeItem(this.storageKey);
    this.updateBadges();
    this.renderDrawer();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: [] } }));
  },

  getTotalCount() {
    return this.getItems().reduce((acc, item) => acc + (item.quantity || 1), 0);
  },

  getSubtotal() {
    const total = this.getItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return Math.round(total * 100) / 100;
  },

  updateBadges() {
    const count = this.getTotalCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  renderDrawer() {
    const listEl = document.querySelector('.cart-items-list');
    const subtotalEl = document.querySelector('.cart-subtotal-val');
    const shippingBar = document.querySelector('.shipping-progress-fill');
    const shippingText = document.querySelector('.shipping-text');

    if (!listEl) return;

    const items = this.getItems();
    const subtotal = this.getSubtotal();

    if (subtotalEl) {
      subtotalEl.textContent = formatPrice(subtotal);
    }

    // Shipping progress bar
    const freeShippingThreshold = 40;
    if (shippingBar && shippingText) {
      const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      shippingBar.style.width = `${percent}%`;

      if (subtotal >= freeShippingThreshold) {
        shippingText.innerHTML = `🎉 You have unlocked <strong>FREE Standard Shipping</strong>!`;
      } else {
        const remaining = (freeShippingThreshold - subtotal).toFixed(2);
        shippingText.innerHTML = `Add <strong>$${remaining}</strong> more for Free Shipping`;
      }
    }

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">☕</div>
          <h4>Your coffee bag is empty</h4>
          <p style="margin-top: 8px; font-size: 0.9rem;">Explore fresh roasts and find your next morning brew.</p>
          <a href="/shop" class="btn btn-primary btn-sm" style="margin-top: 20px;">Explore Roasts</a>
        </div>
      `;
      return;
    }

    listEl.innerHTML = items.map((item, idx) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=400&q=80'">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-meta">${item.size} • ${item.grind}</div>
          <div class="cart-item-row">
            <div class="quantity-control">
              <button class="qty-btn" onclick="CartManager.updateQuantity(${idx}, ${item.quantity - 1})">-</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly>
              <button class="qty-btn" onclick="CartManager.updateQuantity(${idx}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
          </div>
          <button class="cart-item-remove" onclick="CartManager.removeItem(${idx})">Remove</button>
        </div>
      </div>
    `).join('');
  }
};

// Global Drawer Controller
function openCartDrawer() {
  const overlay = document.querySelector('.cart-overlay');
  const drawer = document.querySelector('.cart-drawer');
  if (overlay && drawer) {
    CartManager.renderDrawer();
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.querySelector('.cart-overlay');
  const drawer = document.querySelector('.cart-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateBadges();
  CartManager.renderDrawer();

  // Bind drawer close triggers
  document.querySelectorAll('.cart-close-trigger').forEach(btn => {
    btn.addEventListener('click', closeCartDrawer);
  });
});
