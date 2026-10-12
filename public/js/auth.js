// ==========================================================================
// BeanCraft Authentication Manager
// ==========================================================================

const AuthManager = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('beancraft_user')) || null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('beancraft_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('beancraft_user');
    }
    this.updateUserUI();
  },

  isLoggedIn() {
    return !!API.getToken() && !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  async login(email, password) {
    try {
      const res = await API.post('/auth/login', { email, password });
      API.setToken(res.token);
      this.setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      closeAuthModal();
      window.dispatchEvent(new CustomEvent('authChanged', { detail: res.user }));
      return res;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  },

  async register(name, email, password, phone, address) {
    try {
      const res = await API.post('/auth/register', { name, email, password, phone, address });
      API.setToken(res.token);
      this.setUser(res.user);
      showToast(`Welcome to BeanCraft, ${res.user.name}!`, 'success');
      closeAuthModal();
      window.dispatchEvent(new CustomEvent('authChanged', { detail: res.user }));
      return res;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  },

  logout() {
    API.setToken(null);
    this.setUser(null);
    showToast('Signed out successfully.', 'normal');
    window.dispatchEvent(new CustomEvent('authChanged', { detail: null }));
    setTimeout(() => {
      window.location.reload();
    }, 600);
  },

  updateUserUI() {
    const user = this.getUser();
    const userContainer = document.querySelector('.nav-user-container');
    if (!userContainer) return;

    if (user) {
      userContainer.innerHTML = `
        <div class="user-dropdown-wrapper" style="position: relative;">
          <button class="nav-action-btn" id="userMenuBtn" title="Account Menu">
            <span>☕</span>
          </button>
          <div class="user-dropdown-menu" id="userMenuDropdown" style="display:none; position:absolute; right:0; top:48px; background:#fff; border:1px solid var(--surface-border); border-radius:10px; width:210px; box-shadow:var(--shadow-md); z-index:999; padding:10px 0;">
            <div style="padding:10px 16px; border-bottom:1px solid var(--surface-border);">
              <div style="font-weight:700; font-size:0.9rem; color:var(--primary-espresso);">${user.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${user.email}</div>
              ${user.role === 'admin' ? '<span style="display:inline-block; font-size:0.7rem; background:#eff6ff; color:#2563eb; padding:2px 8px; border-radius:10px; font-weight:700; margin-top:4px;">Admin</span>' : ''}
            </div>
            <a href="/orders" style="display:block; padding:8px 16px; font-size:0.88rem; color:var(--text-body);">📦 My Orders</a>
            ${user.role === 'admin' ? '<a href="/admin" style="display:block; padding:8px 16px; font-size:0.88rem; color:#2563eb; font-weight:600;">⚙️ Admin Dashboard</a>' : ''}
            <button onclick="AuthManager.logout()" style="display:block; width:100%; text-align:left; padding:8px 16px; font-size:0.88rem; color:#dc2626; background:transparent; border:none; cursor:pointer;">🚪 Sign Out</button>
          </div>
        </div>
      `;

      const menuBtn = document.getElementById('userMenuBtn');
      const menuDropdown = document.getElementById('userMenuDropdown');
      if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
          menuDropdown.style.display = 'none';
        });
      }
    } else {
      userContainer.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="openAuthModal('login')">
          Sign In
        </button>
      `;
    }
  }
};

// Modal helpers
function openAuthModal(defaultTab = 'login') {
  const modal = document.querySelector('#authModal');
  if (!modal) return;
  modal.classList.add('open');
  switchAuthTab(defaultTab);
}

function closeAuthModal() {
  const modal = document.querySelector('#authModal');
  if (modal) modal.classList.remove('open');
}

function switchAuthTab(tab) {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  const tabLogin = document.querySelector('#tabBtnLogin');
  const tabReg = document.querySelector('#tabBtnRegister');

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (tabLogin) tabLogin.classList.add('active');
    if (tabReg) tabReg.classList.remove('active');
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabReg) tabReg.classList.add('active');
  }
}

// Quick Autofill helper for demo test accounts
function autofillDemo(role) {
  const emailInput = document.querySelector('#loginEmail');
  const passInput = document.querySelector('#loginPassword');
  if (!emailInput || !passInput) return;

  if (role === 'admin') {
    emailInput.value = 'admin@beancraft.com';
    passInput.value = 'adminpassword123';
  } else {
    emailInput.value = 'sarah@example.com';
    passInput.value = 'coffeeuser123';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.updateUserUI();

  // Login form submit
  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.querySelector('#loginEmail').value;
      const pass = document.querySelector('#loginPassword').value;
      try {
        await AuthManager.login(email, pass);
      } catch (err) {}
    });
  }

  // Register form submit
  const regForm = document.querySelector('#registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.querySelector('#regName').value;
      const email = document.querySelector('#regEmail').value;
      const pass = document.querySelector('#regPassword').value;
      const phone = document.querySelector('#regPhone')?.value || '';
      try {
        await AuthManager.register(name, email, pass, phone);
      } catch (err) {}
    });
  }
});
