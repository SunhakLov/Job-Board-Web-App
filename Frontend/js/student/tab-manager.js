// Tab Manager Module
class TabManager {
  constructor() {
    this.activeTab = 'search';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeTabStyles();
  }

  setupEventListeners() {
    // Tab button click handlers are handled via onclick attributes
    // but we can add additional functionality here if needed
  }

  switchTab(tab) {
    this.activeTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('tab-active');
    });
    
    // Find and activate the clicked tab button
    const clickedButton = event?.target?.closest('.tab-btn');
    if (clickedButton) {
      clickedButton.classList.add('tab-active');
    }

    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    const targetTab = document.getElementById(tab + 'Tab');
    if (targetTab) {
      targetTab.classList.remove('hidden');
    }

    // Load tab-specific content
    this.loadTabContent(tab);
  }

  loadTabContent(tab) {
    switch (tab) {
      case 'search':
        // Ensure job listings are loaded
        if (window.jobManager) {
          window.jobManager.renderJobs();
        }
        break;
      case 'applications':
        // Ensure applications are loaded
        if (window.jobManager) {
          window.jobManager.renderApplications();
        }
        break;
      case 'saved':
        // Ensure saved jobs are loaded
        if (window.jobManager) {
          window.jobManager.renderSavedJobs();
        }
        break;
      case 'profile':
        // Load profile data
        this.loadProfileData();
        break;
    }
  }

  loadProfileData() {
    // Load user profile data if available
    if (window.authManager?.currentUser) {
      const user = window.authManager.currentUser;
      // Update profile form fields with user data
      // This would typically come from an API
    }
  }

  initializeTabStyles() {
    // Add CSS for tab states
    const style = document.createElement('style');
    style.textContent = `
      .tab-btn {
        color: #6b7280;
      }
      .tab-active {
        background-color: white !important;
        color: #1f2937 !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
    `;
    document.head.appendChild(style);
  }
}

// Export for global use
window.TabManager = TabManager;