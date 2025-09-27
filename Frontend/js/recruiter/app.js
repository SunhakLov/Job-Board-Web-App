// Recruiter App Main (Orchestrator)
class RecruiterApp {
  constructor() {
    this.isInitialized = false;
    this.modules = {};
    this.eventListeners = new Map();
    this.init();
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Show loading state
      this.showLoadingState();

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize core modules
      await this.initializeModules();

      // Load components
      await this.loadComponents();

      // Set up global event listeners
      this.setupGlobalEventListeners();

      // Initialize authentication check
      this.performAuthCheck();

      // Hide loading state
      this.hideLoadingState();

      // Mark as initialized
      this.isInitialized = true;

      // Emit app ready event
      this.emitEvent('appReady');

      console.log('Recruiter App initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Recruiter App:', error);
      this.showErrorState(error);
    }
  }

  async initializeModules() {
    // Initialize modules in correct order (dependencies first)
    const moduleOrder = [
      'recruiterToastManager',
      'recruiterAuth', 
      'recruiterJobManager',
      'recruiterCandidateManager',
      'recruiterTabManager'
    ];

    for (const moduleName of moduleOrder) {
      if (window[moduleName]) {
        this.modules[moduleName] = window[moduleName];
        console.log(`✓ ${moduleName} initialized`);
      } else {
        console.warn(`⚠ ${moduleName} not found`);
      }
    }
  }

  async loadComponents() {
    // Initialize component loader if available
    if (window.ComponentLoader) {
      const componentLoader = new window.ComponentLoader();
      await componentLoader.loadComponents();
      console.log('✓ Components loaded');
    }
  }

  setupGlobalEventListeners() {
    // Handle global keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

    // Handle window resize
    window.addEventListener('resize', this.debounce(this.handleWindowResize.bind(this), 250));

    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Handle unload (cleanup)
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    // Handle errors
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    // Custom app events
    window.addEventListener('recruiterTabChanged', this.handleTabChange.bind(this));
    window.addEventListener('recruiterAuthChanged', this.handleAuthChange.bind(this));
  }

  performAuthCheck() {
    // Check authentication status
    if (this.modules.recruiterAuth) {
      const isAuthenticated = this.modules.recruiterAuth.isLoggedIn;
      
      if (!isAuthenticated) {
        // Show welcome message for new users
        setTimeout(() => {
          this.modules.recruiterToastManager?.info('Welcome! Please sign in to access the recruiter portal.', 8000);
        }, 1000);
      } else {
        // Welcome back message
        const userName = this.modules.recruiterAuth.currentUser?.fullName;
        setTimeout(() => {
          this.modules.recruiterToastManager?.success(`Welcome back, ${userName}!`, 3000);
        }, 500);
      }
    }
  }

  handleKeyboardShortcuts(e) {
    // Only handle shortcuts when not typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
      return;
    }

    // Handle keyboard shortcuts with Ctrl/Cmd key
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          this.modules.recruiterTabManager?.switchTab('post-job');
          break;
        case '2':
          e.preventDefault();
          this.modules.recruiterTabManager?.switchTab('job-listings');
          break;
        case '3':
          e.preventDefault();
          this.modules.recruiterTabManager?.switchTab('candidates');
          break;
        case '4':
          e.preventDefault();
          this.modules.recruiterTabManager?.switchTab('company-profile');
          break;
        case '/':
          e.preventDefault();
          this.focusSearchInput();
          break;
        case 'k':
          e.preventDefault();
          this.showQuickActions();
          break;
      }
    }

    // Handle escape key
    if (e.key === 'Escape') {
      this.handleEscapeKey();
    }
  }

  focusSearchInput() {
    const currentTab = this.modules.recruiterTabManager?.getCurrentTab();
    let searchInput;

    switch (currentTab) {
      case 'job-listings':
        searchInput = document.getElementById('job-search');
        break;
      case 'candidates':
        searchInput = document.getElementById('candidate-search');
        break;
    }

    if (searchInput) {
      searchInput.focus();
      this.modules.recruiterToastManager?.info('Search focused', 1000);
    }
  }

  showQuickActions() {
    // Show a modal with quick actions (future enhancement)
    this.modules.recruiterToastManager?.info('Quick actions: Ctrl+1-4 for tabs, Ctrl+/ for search', 5000);
  }

  handleEscapeKey() {
    // Close any open modals or dropdowns
    const modal = document.querySelector('.modal:not(.hidden)');
    if (modal) {
      modal.classList.add('hidden');
    }

    // Clear any selections
    if (this.modules.recruiterCandidateManager) {
      this.modules.recruiterCandidateManager.clearSelection();
    }
  }

  handleWindowResize() {
    // Handle responsive adjustments
    const width = window.innerWidth;
    
    // Add/remove mobile class based on screen size
    if (width < 768) {
      document.body.classList.add('mobile');
    } else {
      document.body.classList.remove('mobile');
    }

    // Emit resize event for modules to handle
    this.emitEvent('windowResize', { width, height: window.innerHeight });
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is now hidden
      this.emitEvent('pageHidden');
    } else {
      // Page is now visible
      this.emitEvent('pageVisible');
      
      // Refresh data if user has been away for a while
      const lastActive = localStorage.getItem('recruiter_last_active');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (!lastActive || (now - parseInt(lastActive)) > fiveMinutes) {
        this.refreshData();
      }
    }
    
    // Update last active timestamp
    localStorage.setItem('recruiter_last_active', Date.now().toString());
  }

  handleBeforeUnload(e) {
    // Save any pending data before user leaves
    this.saveAppState();
    
    // Show warning if there are unsaved changes
    const hasUnsavedChanges = this.checkForUnsavedChanges();
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      return e.returnValue;
    }
  }

  handleGlobalError(event) {
    console.error('Global error caught:', event.error);
    this.modules.recruiterToastManager?.error('An unexpected error occurred. Please refresh the page if issues persist.');
    
    // Log error for debugging (in production, send to error tracking service)
    this.logError('global_error', event.error);
  }

  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    this.modules.recruiterToastManager?.error('A system error occurred. Please try again.');
    
    // Log error for debugging
    this.logError('unhandled_promise_rejection', event.reason);
  }

  handleTabChange(event) {
    const { tabId, previousTab } = event.detail;
    
    // Update page analytics (in real app)
    this.trackPageView(tabId);
    
    // Save user preference
    localStorage.setItem('recruiter_last_tab', tabId);
    
    // Perform tab-specific actions
    this.performTabSpecificActions(tabId, previousTab);
  }

  handleAuthChange(event) {
    const { isLoggedIn, user } = event.detail;
    
    if (isLoggedIn) {
      // User logged in
      this.onUserLogin(user);
    } else {
      // User logged out
      this.onUserLogout();
    }
  }

  performTabSpecificActions(tabId, previousTab) {
    switch (tabId) {
      case 'job-listings':
        // Refresh job listings data
        this.modules.recruiterJobManager?.loadJobListings();
        break;
      case 'candidates':
        // Refresh candidates data
        this.modules.recruiterCandidateManager?.loadCandidates();
        break;
    }
  }

  onUserLogin(user) {
    // Set up user-specific data
    this.loadUserPreferences();
    
    // Track login event
    this.trackUserEvent('login', { userId: user.id });
  }

  onUserLogout() {
    // Clear user-specific data
    this.clearUserData();
    
    // Track logout event
    this.trackUserEvent('logout');
  }

  refreshData() {
    // Refresh application data
    if (this.modules.recruiterAuth?.isLoggedIn) {
      this.modules.recruiterJobManager?.loadJobListings();
      this.modules.recruiterCandidateManager?.loadCandidates();
    }
  }

  checkForUnsavedChanges() {
    // Check for unsaved job drafts
    const jobDraft = localStorage.getItem('recruiter_job_draft');
    if (jobDraft) {
      try {
        const draft = JSON.parse(jobDraft);
        const lastSaved = new Date(draft.lastSaved);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return lastSaved > fiveMinutesAgo;
      } catch (e) {
        return false;
      }
    }
    
    // Check for unsaved form changes
    const forms = document.querySelectorAll('form[data-has-changes]');
    return forms.length > 0;
  }

  saveAppState() {
    // Save current application state
    const appState = {
      currentTab: this.modules.recruiterTabManager?.getCurrentTab(),
      timestamp: Date.now(),
      version: this.getAppVersion()
    };
    
    localStorage.setItem('recruiter_app_state', JSON.stringify(appState));
  }

  loadUserPreferences() {
    const preferences = localStorage.getItem('recruiter_user_preferences');
    if (preferences) {
      try {
        const prefs = JSON.parse(preferences);
        this.applyUserPreferences(prefs);
      } catch (e) {
        console.warn('Failed to load user preferences:', e);
      }
    }
  }

  applyUserPreferences(preferences) {
    // Apply user preferences (theme, language, etc.)
    if (preferences.theme) {
      document.body.classList.add(`theme-${preferences.theme}`);
    }
    
    if (preferences.language) {
      document.documentElement.lang = preferences.language;
    }
  }

  clearUserData() {
    // Clear user-specific localStorage data
    const userDataKeys = [
      'recruiter_user_preferences',
      'recruiter_last_tab',
      'recruiter_job_draft',
      'recruiter_app_state'
    ];
    
    userDataKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  showLoadingState() {
    const loader = document.createElement('div');
    loader.id = 'app-loader';
    loader.className = 'fixed inset-0 bg-white flex items-center justify-center z-50';
    loader.innerHTML = `
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading Recruiter Portal...</p>
      </div>
    `;
    document.body.appendChild(loader);
  }

  hideLoadingState() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.remove();
    }
  }

  showErrorState(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed inset-0 bg-red-50 flex items-center justify-center z-50';
    errorDiv.innerHTML = `
      <div class="text-center p-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h2 class="text-xl font-semibold text-red-800 mb-2">App Initialization Failed</h2>
        <p class="text-red-600 mb-4">${error.message || 'An unexpected error occurred'}</p>
        <button onclick="window.location.reload()" 
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Reload Page
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  emitEvent(eventName, data = {}) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  }

  addEventListener(eventName, callback) {
    window.addEventListener(eventName, callback);
    
    // Store reference for cleanup
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  removeEventListener(eventName, callback) {
    window.removeEventListener(eventName, callback);
    
    // Remove from our tracking
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Analytics and tracking methods (stub for real implementation)
  trackPageView(page) {
    console.log(`[Analytics] Page view: ${page}`);
  }

  trackUserEvent(eventName, data = {}) {
    console.log(`[Analytics] User event: ${eventName}`, data);
  }

  logError(type, error) {
    console.log(`[Error Log] ${type}:`, error);
    // In production, send to error tracking service like Sentry
  }

  getAppVersion() {
    return '1.0.0';
  }

  // Public API for other modules
  getModule(moduleName) {
    return this.modules[moduleName];
  }

  isReady() {
    return this.isInitialized;
  }

  destroy() {
    // Cleanup method
    this.eventListeners.forEach((listeners, eventName) => {
      listeners.forEach(callback => {
        window.removeEventListener(eventName, callback);
      });
    });
    this.eventListeners.clear();
    
    this.saveAppState();
    this.isInitialized = false;
  }
}

// Initialize app when script loads
window.addEventListener('DOMContentLoaded', () => {
  window.recruiterApp = new RecruiterApp();
});

// Expose globally for debugging
window.RecruiterApp = RecruiterApp;