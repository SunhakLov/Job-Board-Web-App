// Main Student Portal Application Controller
class StudentPortalApp {
  constructor() {
    this.modules = {};
    this.init();
  }

  async init() {
    try {
      // Initialize core modules
      this.modules.toastManager = new ToastManager();
      this.modules.authManager = new AuthManager();
      this.modules.jobManager = new JobManager();
      this.modules.tabManager = new TabManager();
      this.modules.profileManager = new ProfileManager();

      // Make modules globally available
      window.toastManager = this.modules.toastManager;
      window.authManager = this.modules.authManager;
      window.jobManager = this.modules.jobManager;
      window.tabManager = this.modules.tabManager;
      window.profileManager = this.modules.profileManager;

      // Setup global event listeners
      this.setupGlobalEventListeners();

      // Initialize the application
      this.initializeApp();

      console.log('Student Portal App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Student Portal App:', error);
    }
  }

  setupGlobalEventListeners() {
    // Handle escape key for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.modules.authManager.closeModal();
      }
    });

    // Handle clicks outside modals
    document.addEventListener('click', (e) => {
      if (e.target.id === 'authModal') {
        this.modules.authManager.closeModal();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  initializeApp() {
    // Initialize default tab
    this.modules.tabManager.switchTab('search');
    
    // Load initial data
    this.loadInitialData();
  }

  loadInitialData() {
    // This would typically load data from APIs
    // For now, our sample data is already loaded in the job manager
    
    // Check for saved user session
    this.checkUserSession();
  }

  checkUserSession() {
    // Check for existing user session (localStorage, sessionStorage, etc.)
    const savedUser = localStorage.getItem('jobConnect_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        this.modules.authManager.currentUser = userData;
        this.modules.authManager.isLoggedIn = true;
        this.modules.authManager.updateUI();
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }
  }

  handleResize() {
    // Handle responsive behavior if needed
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Adjust UI for mobile
      this.adjustForMobile();
    } else {
      // Adjust UI for desktop
      this.adjustForDesktop();
    }
  }

  adjustForMobile() {
    // Mobile-specific adjustments
  }

  adjustForDesktop() {
    // Desktop-specific adjustments
  }

  // Utility methods that can be called globally
  showLoading(message = 'Loading...') {
    this.modules.toastManager.show(message, 'info');
  }

  hideLoading() {
    // Implementation for hiding loading state
  }

  handleError(error, userMessage = 'An error occurred') {
    console.error('Application Error:', error);
    this.modules.toastManager.show(userMessage, 'error');
  }

  // API simulation methods
  async makeAPICall(endpoint, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate different responses based on endpoint
    switch (endpoint) {
      case '/api/jobs':
        return this.modules.jobManager.jobs;
      case '/api/applications':
        return this.modules.jobManager.applications;
      case '/api/profile':
        return this.modules.profileManager.userProfile;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }
}

// Global functions for onclick handlers (maintaining backward compatibility)
function showAuthModal(type) {
  window.authManager?.showModal(type);
}

function closeAuthModal() {
  window.authManager?.closeModal();
}

function logout() {
  window.authManager?.logout();
}

function switchTab(tab) {
  window.tabManager?.switchTab(tab);
}

function addSkill() {
  window.profileManager?.addSkill();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.studentPortalApp = new StudentPortalApp();
});

// Export for potential module use
window.StudentPortalApp = StudentPortalApp;