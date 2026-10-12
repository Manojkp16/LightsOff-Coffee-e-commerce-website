// ==========================================================================
// BeanCraft Product Detail Page Controller
// ==========================================================================

const ProductDetailController = {
  product: null,
  selectedSize: '250g',
  selectedGrind: 'Whole Bean',
  quantity: 1,

  async init() {
    // Get product ID or slug from URL path or param
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    let productId = pathParts[pathParts.length - 1];

    if (productId === 'product' || productId === 'product.html') {
      const urlParams = new URLSearchParams(window.location.search);
      productId = urlParams.get('id');
    }

    if (!productId) {
      window.location.href = '/shop';
      return;
    }

    await this.fetchProduct(productId);
    await this.fetchReviews(productId);
    this.bindReviewForm(productId);
  },

  async fetchProduct(id) {
    const container = document.querySelector('#productDetailContainer');
    if (!container) return;

    try {
      const res = await API.get(`/products/${id}`);
      this.product = res.data;
      this.renderProductDetails();
    } catch (error) {
      container.innerHTML = `
        <div style="text-align: center; padding: 80px 20px;">
          <h2>Product Not Found</h2>
          <p style="margin: 16px 0 24px; color: var(--text-muted);">The coffee you're looking for might have been retired or moved.</p>
          <a href="/shop" class="btn btn-primary">Return to Shop</a>
        </div>
      `;
    }
  },

  renderProductDetails() {
    const container = document.querySelector('#productDetailContainer');
    if (!container || !this.product) return;

    const p = this.product;
    this.selectedSize = (p.sizes && p.sizes[0]?.size) || '250g';
    this.selectedGrind = (p.grindOptions && p.grindOptions[0]) || 'Whole Bean';

    // Calculate initial price
    const sizeObj = p.sizes ? p.sizes.find(s => s.size === this.selectedSize) : null;
    const multiplier = sizeObj ? sizeObj.priceMultiplier : 1;
    const currentPrice = Math.round(p.price * multiplier * 100) / 100;

    // Tasting Notes HTML
    const tastingHtml = (p.flavorNotes || []).map(f => `<span class="tasting-pill">${f}</span>`).join('');

    // Sizes Pills
    const sizesHtml = (p.sizes || []).map(s => `
      <button class="option-btn size-opt-btn ${s.size === this.selectedSize ? 'selected' : ''}" data-size="${s.size}" data-multiplier="${s.priceMultiplier}">
        ${s.size}
      </button>
    `).join('');

    // Grind Pills
    const grindsHtml = (p.grindOptions || []).map(g => `
      <button class="option-btn grind-opt-btn ${g === this.selectedGrind ? 'selected' : ''}" data-grind="${g}">
        ${g}
      </button>
    `).join('');

    // Roast Meter Dots
    let roastDots = '';
    if (p.roastMeter) {
      roastDots = `
        <div style="display:flex; align-items:center; gap:8px; margin: 12px 0;">
          <strong style="font-size:0.88rem;">Roast Level (${p.roastLevel}):</strong>
          <div class="roast-dots">
            ${[1, 2, 3, 4, 5].map(i => `<div class="roast-dot ${i <= p.roastMeter ? 'active' : ''}"></div>`).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-detail-gallery">
          <img src="${p.primaryImage}" alt="${p.name}" class="detail-main-img" id="detailMainImg" onerror="this.src='https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80'">
        </div>

        <div class="product-detail-info">
          <span style="text-transform:uppercase; font-size:0.85rem; font-weight:700; color:var(--accent-caramel); letter-spacing:1px;">${p.origin || p.category}</span>
          <h1>${p.name}</h1>
          <p style="color:var(--text-muted); font-size:1.05rem; margin-bottom:12px;">${p.subtitle}</p>

          <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
            <span style="color:var(--accent-amber); font-size:1.1rem;">★ ${p.rating.toFixed(1)}</span>
            <span style="color:var(--text-muted); font-size:0.85rem;">(${p.numReviews} verified customer reviews)</span>
          </div>

          <div class="detail-price-box">
            <span class="detail-price" id="displayDetailPrice">${formatPrice(currentPrice)}</span>
            ${p.originalPrice ? `<span class="detail-original-price">${formatPrice(p.originalPrice)}</span>` : ''}
          </div>

          <p style="color:var(--text-body); line-height:1.7; margin-bottom:20px;">${p.description}</p>

          ${roastDots}

          <div style="margin: 16px 0;">
            <strong style="font-size:0.88rem; display:block; margin-bottom:6px;">Tasting & Aroma Profile:</strong>
            <div class="tasting-notes-pill-box">${tastingHtml}</div>
          </div>

          <!-- Size Selection -->
          <div class="option-selector-group">
            <span class="option-selector-label">Select Bag Size:</span>
            <div class="size-pill-group">${sizesHtml}</div>
          </div>

          <!-- Grind Selection -->
          <div class="option-selector-group">
            <span class="option-selector-label">Select Grind Type:</span>
            <div class="grind-pill-group">${grindsHtml}</div>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="detail-actions-row">
            <div class="quantity-control" style="height: 48px;">
              <button class="qty-btn" id="btnDetailDecQty" style="width: 36px; height: 100%;">-</button>
              <input type="text" class="qty-input" id="detailQtyInput" value="1" readonly style="width: 44px; font-size: 1rem;">
              <button class="qty-btn" id="btnDetailIncQty" style="width: 36px; height: 100%;">+</button>
            </div>

            <button class="btn btn-primary" id="btnDetailAddToCart" style="flex-grow: 1; height: 48px;">
              Add to Bag • <span id="btnDetailPriceLabel">${formatPrice(currentPrice)}</span>
            </button>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin: 16px 0 24px; padding-top: 14px; border-top: 1px dashed var(--surface-border); flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Share this roast with network:</span>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-linkedin-btn" title="Share roast on LinkedIn">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2"/></svg>
              <span>Share on LinkedIn</span>
            </a>
          </div>

          <!-- Origin & Processing Specs -->
          <table class="detail-attributes-table">
            <tbody>
              <tr><td>Origin</td><td>${p.origin || 'Artisan Estate'}</td></tr>
              <tr><td>Elevation</td><td>${p.elevation || '1,600m+'}</td></tr>
              <tr><td>Process</td><td>${p.process || 'Washed'}</td></tr>
              <tr><td>Acidity & Body</td><td>${p.acidity} Acidity • ${p.body} Body</td></tr>
              <tr><td>Roast Profile</td><td>Freshly roasted on demand</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindDetailEvents();
  },

  bindDetailEvents() {
    const p = this.product;

    // Size Selection clicks
    document.querySelectorAll('.size-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.size-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedSize = btn.dataset.size;
        const multiplier = parseFloat(btn.dataset.multiplier) || 1;
        this.updatePriceDisplay(multiplier);
      });
    });

    // Grind Selection clicks
    document.querySelectorAll('.grind-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.grind-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedGrind = btn.dataset.grind;
      });
    });

    // Quantity Inc/Dec
    const qtyInput = document.querySelector('#detailQtyInput');
    document.querySelector('#btnDetailIncQty')?.addEventListener('click', () => {
      this.quantity++;
      if (qtyInput) qtyInput.value = this.quantity;
      this.updateTotalAddButton();
    });

    document.querySelector('#btnDetailDecQty')?.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        if (qtyInput) qtyInput.value = this.quantity;
        this.updateTotalAddButton();
      }
    });

    // Add To Cart
    document.querySelector('#btnDetailAddToCart')?.addEventListener('click', () => {
      CartManager.addItem(this.product, this.selectedSize, this.selectedGrind, this.quantity);
      openCartDrawer();
    });
  },

  updatePriceDisplay(multiplier) {
    const singlePrice = Math.round(this.product.price * multiplier * 100) / 100;
    const displayPrice = document.querySelector('#displayDetailPrice');
    if (displayPrice) displayPrice.textContent = formatPrice(singlePrice);
    this.updateTotalAddButton();
  },

  updateTotalAddButton() {
    const sizeObj = this.product.sizes?.find(s => s.size === this.selectedSize);
    const multiplier = sizeObj ? sizeObj.priceMultiplier : 1;
    const singlePrice = Math.round(this.product.price * multiplier * 100) / 100;
    const total = singlePrice * this.quantity;
    const label = document.querySelector('#btnDetailPriceLabel');
    if (label) label.textContent = formatPrice(total);
  },

  async fetchReviews(id) {
    const listEl = document.querySelector('#reviewsListContainer');
    if (!listEl) return;

    try {
      const res = await API.get(`/products/${id}/reviews`);
      const reviews = res.data || [];

      if (reviews.length === 0) {
        listEl.innerHTML = `<p style="color:var(--text-muted); font-style:italic;">No reviews yet. Be the first to brew and review this roast!</p>`;
        return;
      }

      listEl.innerHTML = reviews.map(r => `
        <div style="background:var(--surface-white); border:1px solid var(--surface-border); border-radius:12px; padding:20px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:700; color:var(--primary-espresso);">${r.name}</div>
            <div style="color:var(--accent-amber); font-size:0.9rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          </div>
          ${r.title ? `<div style="font-weight:600; font-size:0.92rem; margin-bottom:6px;">${r.title}</div>` : ''}
          <p style="font-size:0.9rem; color:var(--text-body); line-height:1.5;">${r.comment}</p>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:8px;">${new Date(r.createdAt).toLocaleDateString()} • Verified Coffee Drinker</div>
        </div>
      `).join('');
    } catch (e) {
      listEl.innerHTML = `<p>Error loading reviews.</p>`;
    }
  },

  bindReviewForm(id) {
    const form = document.querySelector('#addReviewForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.querySelector('#reviewName').value;
      const rating = document.querySelector('#reviewRating').value;
      const title = document.querySelector('#reviewTitle').value;
      const comment = document.querySelector('#reviewComment').value;

      try {
        await API.post(`/products/${id}/reviews`, { name, rating, title, comment });
        showToast('Review submitted! Thank you.', 'success');
        form.reset();
        this.fetchReviews(id);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ProductDetailController.init();
});
