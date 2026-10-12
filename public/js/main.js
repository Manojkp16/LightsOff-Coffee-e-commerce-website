// ==========================================================================
// BeanCraft Main Application Logic (Home page, Quiz, Common UI)
// ==========================================================================

// Global Product Card HTML Builder
function createProductCardHtml(product) {
  const isOutOfStock = product.stock <= 0;
  const ratingStars = '★'.repeat(Math.round(product.rating || 5)) + '☆'.repeat(5 - Math.round(product.rating || 5));

  // Roast meter dots
  let roastDotsHtml = '';
  if (product.roastMeter && product.roastMeter > 0) {
    roastDotsHtml = `
      <div class="roast-meter-bar" title="Roast Level: ${product.roastLevel} (${product.roastMeter}/5)">
        <span style="color:var(--text-muted); font-size:0.75rem;">Roast:</span>
        <div class="roast-dots">
          ${[1, 2, 3, 4, 5].map(i => `<div class="roast-dot ${i <= product.roastMeter ? 'active' : ''}"></div>`).join('')}
        </div>
      </div>
    `;
  }

  // Flavor badges
  const flavorHtml = (product.flavorNotes || []).slice(0, 3).map(f => `
    <span class="flavor-tag">${f}</span>
  `).join('');

  return `
    <div class="product-card" data-id="${product._id}">
      <div class="product-badge-group">
        ${product.isBestSeller ? '<span class="badge badge-bestseller">Best Seller</span>' : ''}
        ${product.isFeatured ? '<span class="badge badge-featured">Signature</span>' : ''}
        ${product.originalPrice ? '<span class="badge badge-sale">Sale</span>' : ''}
      </div>

      <div class="product-image-container">
        <a href="/product/${product._id}">
          <img src="${product.primaryImage}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80'">
        </a>
        <a href="/product/${product._id}" class="product-quick-view">Quick View</a>
      </div>

      <div class="product-info">
        <div class="product-meta">
          <span class="product-origin">${product.origin || product.category}</span>
          <span class="product-rating">
            <span class="star">★</span> ${product.rating.toFixed(1)} (${product.numReviews})
          </span>
        </div>

        <h3 class="product-name">
          <a href="/product/${product._id}">${product.name}</a>
        </h3>

        <p class="product-subtitle">${product.subtitle || product.description.substring(0, 80) + '...'}</p>

        ${roastDotsHtml}

        <div class="flavor-tags">${flavorHtml}</div>

        <div class="product-footer">
          <div class="product-price-wrapper">
            <span class="product-price">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick='handleQuickAddToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})' title="Add to Bag">
            ＋
          </button>
        </div>
      </div>
    </div>
  `;
}

// Quick Add to cart handler
function handleQuickAddToCart(product) {
  CartManager.addItem(product, '250g', 'Whole Bean', 1);
  openCartDrawer();
}

// Home Page: Load Featured Coffees
async function loadHomeFeaturedProducts() {
  const container = document.querySelector('#featuredProductsGrid');
  if (!container) return;

  try {
    const res = await API.get('/products/featured');
    if (res.data && res.data.length > 0) {
      container.innerHTML = res.data.map(createProductCardHtml).join('');
    } else {
      container.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No featured products at the moment.</p>`;
    }
  } catch (error) {
    container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#dc2626;">Failed to load coffees. Check MongoDB connection.</p>`;
  }
}

// Interactive Coffee Quiz Engine
const CoffeeQuiz = {
  answers: {
    roast: null,
    brew: null,
    flavor: null
  },

  selectOption(stepKey, value, element) {
    this.answers[stepKey] = value;
    const parent = element.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');

    if (stepKey === 'roast') {
      document.querySelector('#quizStep1').classList.remove('active');
      document.querySelector('#quizStep2').classList.add('active');
    } else if (stepKey === 'brew') {
      document.querySelector('#quizStep2').classList.remove('active');
      document.querySelector('#quizStep3').classList.add('active');
    } else if (stepKey === 'flavor') {
      this.calculateRecommendation();
    }
  },

  resetQuiz() {
    this.answers = { roast: null, brew: null, flavor: null };
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.querySelector('#quizStep1').classList.add('active');
    document.querySelector('#quizResult').style.display = 'none';
  },

  async calculateRecommendation() {
    const resultBox = document.querySelector('#quizResult');
    if (!resultBox) return;

    resultBox.style.display = 'block';
    resultBox.innerHTML = `<p style="text-align:center; padding:20px;">Brewing your personalized recommendation...</p>`;

    try {
      const res = await API.get('/products');
      const products = res.data || [];
      if (products.length === 0) return;

      // Filter or rank based on roast and flavor
      let match = products.find(p => p.roastLevel === this.answers.roast);
      if (!match) {
        match = products[0];
      }

      resultBox.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.96); color: var(--text-dark); border-radius: 16px; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: var(--shadow-lg);">
          <span style="text-transform:uppercase; font-size:0.8rem; font-weight:800; color:var(--accent-caramel); letter-spacing:1px;">Your Perfect Coffee Match</span>
          <h3 style="font-size:1.8rem; margin:8px 0 12px; color:var(--primary-espresso);">${match.name}</h3>
          <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">${match.subtitle || match.description}</p>
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; border-top:1px solid var(--surface-border); padding-top:16px;">
            <div style="font-size:1.4rem; font-weight:800; color:var(--primary-espresso);">${formatPrice(match.price)}</div>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary btn-sm" onclick="CoffeeQuiz.resetQuiz()">Take Again</button>
              <button class="btn btn-primary btn-sm" onclick='handleQuickAddToCart(${JSON.stringify(match).replace(/'/g, "&apos;")})'>Add Match to Bag</button>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      resultBox.innerHTML = `<p>Error loading recommendation.</p>`;
    }
  }
};

// DOM Init
document.addEventListener('DOMContentLoaded', () => {
  loadHomeFeaturedProducts();

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '76px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#fbf7ee';
      navLinks.style.padding = '20px';
      navLinks.style.boxShadow = 'var(--shadow-md)';
    });
  }

  // Newsletter Form
  const newsletterForm = document.querySelector('#newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        showToast(`Thank you for subscribing! Your 10% welcome coupon is COFFEE10`, 'success');
        input.value = '';
      }
    });
  }
});
