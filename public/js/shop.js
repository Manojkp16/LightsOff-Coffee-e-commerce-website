// ==========================================================================
// BeanCraft Shop Catalog & Filter Controller
// ==========================================================================

const ShopController = {
  state: {
    category: 'All',
    roastLevel: 'All',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'newest'
  },

  init() {
    // Read URL query parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) this.state.category = params.get('category');
    if (params.get('roastLevel')) this.state.roastLevel = params.get('roastLevel');
    if (params.get('search')) this.state.search = params.get('search');
    if (params.get('sort')) this.state.sort = params.get('sort');

    this.bindEvents();
    this.syncFormWithState();
    this.fetchProducts();
  },

  syncFormWithState() {
    // Category radio
    const catRadio = document.querySelector(`input[name="category"][value="${this.state.category}"]`);
    if (catRadio) catRadio.checked = true;

    // Roast radio
    const roastRadio = document.querySelector(`input[name="roastLevel"][value="${this.state.roastLevel}"]`);
    if (roastRadio) roastRadio.checked = true;

    // Search input
    const searchInput = document.querySelector('#shopSearchInput');
    if (searchInput) searchInput.value = this.state.search;

    // Sort select
    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) sortSelect.value = this.state.sort;
  },

  bindEvents() {
    // Category change
    document.querySelectorAll('input[name="category"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        this.fetchProducts();
      });
    });

    // Roast level change
    document.querySelectorAll('input[name="roastLevel"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.roastLevel = e.target.value;
        this.fetchProducts();
      });
    });

    // Sort select change
    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.state.sort = e.target.value;
        this.fetchProducts();
      });
    }

    // Search input with debounce
    const searchInput = document.querySelector('#shopSearchInput');
    let debounceTimer;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.state.search = e.target.value.trim();
          this.fetchProducts();
        }, 300);
      });
    }

    // Price filter button
    const priceForm = document.querySelector('#priceFilterForm');
    if (priceForm) {
      priceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.state.minPrice = document.querySelector('#minPriceInput').value;
        this.state.maxPrice = document.querySelector('#maxPriceInput').value;
        this.fetchProducts();
      });
    }

    // Reset filters
    const resetBtn = document.querySelector('#btnResetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.state = {
          category: 'All',
          roastLevel: 'All',
          minPrice: '',
          maxPrice: '',
          search: '',
          sort: 'newest'
        };
        const minP = document.querySelector('#minPriceInput');
        const maxP = document.querySelector('#maxPriceInput');
        if (minP) minP.value = '';
        if (maxP) maxP.value = '';
        this.syncFormWithState();
        this.fetchProducts();
      });
    }
  },

  async fetchProducts() {
    const grid = document.querySelector('#shopProductsGrid');
    const countEl = document.querySelector('#resultsCountText');

    if (!grid) return;
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 0;"><p>Curating coffee selections...</p></div>`;

    // Build query params
    const query = new URLSearchParams();
    if (this.state.category && this.state.category !== 'All') query.append('category', this.state.category);
    if (this.state.roastLevel && this.state.roastLevel !== 'All') query.append('roastLevel', this.state.roastLevel);
    if (this.state.minPrice) query.append('minPrice', this.state.minPrice);
    if (this.state.maxPrice) query.append('maxPrice', this.state.maxPrice);
    if (this.state.search) query.append('search', this.state.search);
    if (this.state.sort) query.append('sort', this.state.sort);

    try {
      const res = await API.get(`/products?${query.toString()}`);
      const products = res.data || [];

      if (countEl) {
        countEl.textContent = `Showing ${products.length} artisan coffee${products.length === 1 ? '' : 's'}`;
      }

      if (products.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">☕</div>
            <h3 style="font-size: 1.4rem; margin-bottom: 8px;">No coffees found matching your criteria</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your filters or clearing search terms.</p>
            <button class="btn btn-primary btn-sm" onclick="document.querySelector('#btnResetFilters').click()">Reset Filters</button>
          </div>
        `;
        return;
      }

      grid.innerHTML = products.map(createProductCardHtml).join('');
    } catch (error) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: #dc2626; padding: 40px 0;">
          <p>Failed to load coffee catalog: ${error.message}</p>
        </div>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ShopController.init();
});
