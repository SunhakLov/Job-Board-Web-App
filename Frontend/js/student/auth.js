// Authentication Module
class AuthManager {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkLoginStatus();
  }

  setupEventListeners() {
    // Handle form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(e);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister(e);
      });
    }
  }

  showModal(type) {
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    const subtitle = document.getElementById('authSubtitle');
    const switchText = document.getElementById('authSwitchText');
    const switchBtn = document.getElementById('authSwitch');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    modal.classList.remove('hidden');

    if (type === 'login') {
      title.textContent = 'Welcome Back!';
      subtitle.textContent = 'Sign in to your student account';
      switchText.textContent = "Don't have an account?";
      switchBtn.textContent = 'Sign up';
      switchBtn.onclick = () => this.showModal('register');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      title.textContent = 'Create Account';
      subtitle.textContent = 'Join thousands of students finding opportunities';
      switchText.textContent = 'Already have an account?';
      switchBtn.textContent = 'Sign in';
      switchBtn.onclick = () => this.showModal('login');
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    }
  }

  closeModal() {
    document.getElementById('authModal').classList.add('hidden');
  }

  handleLogin(e) {
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    // Simulate login process
    setTimeout(() => {
      this.isLoggedIn = true;
      this.currentUser = {
        email: email,
        name: 'John Student',
        university: 'Stanford University',
        major: 'Computer Science'
      };
      this.closeModal();
      this.updateUI();
      window.toastManager?.show('Welcome back! You\'ve successfully signed in.', 'success');
    }, 1000);
  }

  handleRegister(e) {
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    
    // Simulate registration process
    setTimeout(() => {
      this.isLoggedIn = true;
      this.currentUser = {
        name: `${firstName} ${lastName}`,
        email: formData.get('email'),
        university: formData.get('university'),
        major: formData.get('major')
      };
      this.closeModal();
      this.updateUI();
      window.toastManager?.show('Account created successfully! Welcome to JobConnect.', 'success');
    }, 1000);
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.updateUI();
    window.toastManager?.show('You\'ve been logged out successfully.', 'info');
  }

  updateUI() {
    const welcomeSection = document.getElementById('welcomeSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const guestNav = document.getElementById('guestNav');
    const userNav = document.getElementById('userNav');

    if (this.isLoggedIn) {
      welcomeSection?.classList.add('hidden');
      dashboardSection?.classList.remove('hidden');
      guestNav?.classList.add('hidden');
      userNav?.classList.remove('hidden');
    } else {
      welcomeSection?.classList.remove('hidden');
      dashboardSection?.classList.add('hidden');
      guestNav?.classList.remove('hidden');
      userNav?.classList.add('hidden');
    }
  }

  checkLoginStatus() {
    // Check for existing session (localStorage, cookies, etc.)
    // For now, assume user is not logged in
    this.isLoggedIn = false;
    this.updateUI();
  }
}

// Export for use in other modules
window.AuthManager = AuthManager;