// Recruiter Authentication Module
class RecruiterAuth {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.isLoggedIn = !!this.currentUser;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    // Login form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'recruiter-login-form') {
        e.preventDefault();
        this.handleLogin(e.target);
      }
    });

    // Register form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'recruiter-register-form') {
        e.preventDefault();
        this.handleRegister(e.target);
      }
    });

    // Logout button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'recruiter-logout-btn' || e.target.closest('#recruiter-logout-btn')) {
        this.handleLogout();
      }
    });

    // Auth modal controls
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="show-login"], [data-action="show-register"]')) {
        this.showAuthModal(e.target.dataset.action === 'show-register');
      }
      
      if (e.target.matches('[data-action="close-auth"]')) {
        this.hideAuthModal();
      }
    });
  }

  async handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // Simulate API call
      const response = await this.simulateLogin(email, password);
      
      if (response.success) {
        this.setCurrentUser(response.user);
        this.hideAuthModal();
        window.recruiterToastManager?.show('Login successful!', 'success');
        this.updateUI();
        
        // Redirect to dashboard or reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      window.recruiterToastManager?.show(error.message, 'error');
    }
  }

  async handleRegister(form) {
    const formData = new FormData(form);
    const userData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      companyName: formData.get('companyName'),
      jobTitle: formData.get('jobTitle'),
      companySize: formData.get('companySize')
    };

    // Validation
    if (userData.password !== userData.confirmPassword) {
      window.recruiterToastManager?.show('Passwords do not match', 'error');
      return;
    }

    if (userData.password.length < 6) {
      window.recruiterToastManager?.show('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      // Simulate API call
      const response = await this.simulateRegister(userData);
      
      if (response.success) {
        this.setCurrentUser(response.user);
        this.hideAuthModal();
        window.recruiterToastManager?.show('Registration successful! Welcome to the platform.', 'success');
        this.updateUI();
        
        // Redirect to dashboard or reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      window.recruiterToastManager?.show(error.message, 'error');
    }
  }

  handleLogout() {
    localStorage.removeItem('recruiter_user');
    this.currentUser = null;
    this.isLoggedIn = false;
    window.recruiterToastManager?.show('Logged out successfully', 'success');
    
    // Redirect to home or reload
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  }

  // Simulate API calls (replace with actual API calls)
  async simulateLogin(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo credentials
        if (email === 'recruiter@techcorp.com' && password === 'password123') {
          resolve({
            success: true,
            user: {
              id: 1,
              fullName: 'Sarah Johnson',
              email: 'recruiter@techcorp.com',
              companyName: 'TechCorp Inc.',
              jobTitle: 'Senior Talent Acquisition Manager',
              companySize: '11-50',
              joinedDate: '2024-01-15'
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid email or password'
          });
        }
      }, 1000);
    });
  }

  async simulateRegister(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if email already exists (simulation)
        if (userData.email === 'existing@email.com') {
          resolve({
            success: false,
            message: 'Email already registered'
          });
        } else {
          resolve({
            success: true,
            user: {
              id: Date.now(),
              fullName: userData.fullName,
              email: userData.email,
              companyName: userData.companyName,
              jobTitle: userData.jobTitle,
              companySize: userData.companySize,
              joinedDate: new Date().toISOString().split('T')[0]
            }
          });
        }
      }, 1500);
    });
  }

  getCurrentUser() {
    const userData = localStorage.getItem('recruiter_user');
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user) {
    localStorage.setItem('recruiter_user', JSON.stringify(user));
    this.currentUser = user;
    this.isLoggedIn = true;
  }

  updateUI() {
    // Update user info in header
    const userNameElements = document.querySelectorAll('[data-user-name]');
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    const companyNameElements = document.querySelectorAll('[data-company-name]');

    if (this.currentUser) {
      userNameElements.forEach(el => el.textContent = this.currentUser.fullName);
      userEmailElements.forEach(el => el.textContent = this.currentUser.email);
      companyNameElements.forEach(el => el.textContent = this.currentUser.companyName);
    }

    // Show/hide auth-related elements
    const authElements = document.querySelectorAll('[data-auth-required]');
    const guestElements = document.querySelectorAll('[data-guest-only]');

    authElements.forEach(el => {
      el.style.display = this.isLoggedIn ? 'block' : 'none';
    });

    guestElements.forEach(el => {
      el.style.display = this.isLoggedIn ? 'none' : 'block';
    });
  }

  showAuthModal(showRegister = false) {
    const modal = document.getElementById('recruiter-auth-modal');
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');

    if (modal) {
      modal.classList.remove('hidden');
      
      if (showRegister) {
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
      } else {
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
      }
    }
  }

  hideAuthModal() {
    const modal = document.getElementById('recruiter-auth-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  // Check if user is authenticated (for protecting routes)
  requireAuth() {
    if (!this.isLoggedIn) {
      this.showAuthModal();
      return false;
    }
    return true;
  }

  // Get user permissions (for feature access control)
  hasPermission(permission) {
    if (!this.isLoggedIn) return false;
    
    // Add permission logic based on user role, subscription, etc.
    const permissions = {
      'post_jobs': true,
      'view_candidates': true,
      'schedule_interviews': true,
      'manage_company': this.currentUser?.jobTitle?.includes('Manager') || this.currentUser?.jobTitle?.includes('Director'),
      'bulk_actions': this.currentUser?.companySize !== '1-10'
    };

    return permissions[permission] || false;
  }
}

// Initialize and expose globally
window.recruiterAuth = new RecruiterAuth();