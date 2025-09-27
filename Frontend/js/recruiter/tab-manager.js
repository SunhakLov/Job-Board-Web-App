// Recruiter Tab Manager
class RecruiterTabManager {
  constructor() {
    this.activeTab = 'post-job';
    this.tabs = ['post-job', 'job-listings', 'candidates', 'company-profile'];
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadInitialTab();
  }

  bindEvents() {
    // Tab button clicks
    document.addEventListener('click', (e) => {
      const tabButton = e.target.closest('.tab-button');
      if (tabButton) {
        const tabId = tabButton.dataset.tab;
        if (tabId && this.tabs.includes(tabId)) {
          this.switchTab(tabId);
        }
      }
    });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
      const tab = e.state?.tab || 'post-job';
      this.switchTab(tab, false);
    });
  }

  loadInitialTab() {
    // Get tab from URL hash or default to first tab
    const hash = window.location.hash.replace('#', '');
    const initialTab = this.tabs.includes(hash) ? hash : 'post-job';
    this.switchTab(initialTab, false);
  }

  switchTab(tabId, updateHistory = true) {
    if (!this.tabs.includes(tabId)) {
      console.warn(`Invalid tab ID: ${tabId}`);
      return;
    }

    // Check authentication for certain tabs
    if (['candidates', 'job-listings'].includes(tabId) && !window.recruiterAuth?.requireAuth()) {
      return;
    }

    this.activeTab = tabId;

    // Update tab buttons
    this.updateTabButtons();

    // Show/hide tab content
    this.updateTabContent();

    // Update URL hash
    if (updateHistory) {
      window.history.pushState({ tab: tabId }, '', `#${tabId}`);
    } else {
      window.history.replaceState({ tab: tabId }, '', `#${tabId}`);
    }

    // Update page title
    this.updatePageTitle();

    // Trigger tab-specific initialization
    this.initializeTabContent(tabId);

    // Emit custom event for other modules to listen
    window.dispatchEvent(new CustomEvent('recruiterTabChanged', {
      detail: { tabId, previousTab: this.previousTab }
    }));

    this.previousTab = tabId;
  }

  updateTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      const tabId = button.dataset.tab;
      if (tabId === this.activeTab) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  updateTabContent() {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      if (content.id === this.activeTab) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }

  updatePageTitle() {
    const tabTitles = {
      'post-job': 'Post Job - Recruiter Portal',
      'job-listings': 'My Job Listings - Recruiter Portal',
      'candidates': 'Candidates - Recruiter Portal',
      'company-profile': 'Company Profile - Recruiter Portal'
    };

    document.title = tabTitles[this.activeTab] || 'Recruiter Portal';
  }

  initializeTabContent(tabId) {
    switch (tabId) {
      case 'post-job':
        this.initializePostJobTab();
        break;
      case 'job-listings':
        this.initializeJobListingsTab();
        break;
      case 'candidates':
        this.initializeCandidatesTab();
        break;
      case 'company-profile':
        this.initializeCompanyProfileTab();
        break;
    }
  }

  initializePostJobTab() {
    // Initialize post job form functionality
    const form = document.getElementById('post-job-form');
    if (form && !form.hasAttribute('data-initialized')) {
      form.setAttribute('data-initialized', 'true');
      
      // Auto-save draft functionality
      this.setupAutoSave(form);
      
      // Skills input enhancement
      this.enhanceSkillsInput();
      
      // Form validation
      this.setupFormValidation(form);
    }
  }

  initializeJobListingsTab() {
    // Initialize job listings functionality
    if (!document.getElementById('job-listings-container').hasAttribute('data-initialized')) {
      document.getElementById('job-listings-container').setAttribute('data-initialized', 'true');
      
      // Setup search and filters
      this.setupJobListingsFilters();
      
      // Load job listings
      window.recruiterJobManager?.loadJobListings();
    }
  }

  initializeCandidatesTab() {
    // Initialize candidates functionality
    if (!document.getElementById('candidates-container').hasAttribute('data-initialized')) {
      document.getElementById('candidates-container').setAttribute('data-initialized', 'true');
      
      // Setup candidate filters
      this.setupCandidateFilters();
      
      // Load candidates
      window.recruiterCandidateManager?.loadCandidates();
    }
  }

  initializeCompanyProfileTab() {
    // Initialize company profile functionality
    const form = document.getElementById('company-profile-form');
    if (form && !form.hasAttribute('data-initialized')) {
      form.setAttribute('data-initialized', 'true');
      
      // Load existing profile data
      this.loadCompanyProfileData();
      
      // Setup logo upload
      this.setupLogoUpload();
    }
  }

  setupAutoSave(form) {
    let autoSaveTimeout;
    
    form.addEventListener('input', () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        this.saveDraft(form);
      }, 2000); // Auto-save after 2 seconds of inactivity
    });
  }

  saveDraft(form) {
    const formData = new FormData(form);
    const draftData = Object.fromEntries(formData.entries());
    
    localStorage.setItem('recruiter_job_draft', JSON.stringify({
      ...draftData,
      lastSaved: new Date().toISOString()
    }));
    
    // Show subtle save indicator
    this.showSaveIndicator();
  }

  showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'fixed top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm z-50';
    indicator.textContent = 'Draft saved';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 2000);
  }

  enhanceSkillsInput() {
    const skillsInput = document.getElementById('skills');
    if (skillsInput) {
      // Add skill suggestion functionality
      skillsInput.addEventListener('input', (e) => {
        const value = e.target.value;
        // Could add auto-complete functionality here
      });
    }
  }

  setupFormValidation(form) {
    form.addEventListener('submit', (e) => {
      if (!this.validateJobForm(form)) {
        e.preventDefault();
      }
    });
  }

  validateJobForm(form) {
    const formData = new FormData(form);
    const errors = [];

    // Required field validation
    if (!formData.get('jobTitle')?.trim()) {
      errors.push('Job title is required');
    }
    
    if (!formData.get('employmentType')) {
      errors.push('Employment type is required');
    }
    
    if (!formData.get('location')?.trim()) {
      errors.push('Location is required');
    }
    
    if (!formData.get('jobDescription')?.trim()) {
      errors.push('Job description is required');
    }
    
    if (!formData.get('requirements')?.trim()) {
      errors.push('Requirements are required');
    }

    // Salary validation
    const salaryMin = parseInt(formData.get('salaryMin'));
    const salaryMax = parseInt(formData.get('salaryMax'));
    
    if (salaryMin && salaryMax && salaryMin >= salaryMax) {
      errors.push('Maximum salary must be greater than minimum salary');
    }

    if (errors.length > 0) {
      window.recruiterToastManager?.show(errors[0], 'error');
      return false;
    }

    return true;
  }

  setupJobListingsFilters() {
    const searchInput = document.getElementById('job-search');
    const statusFilter = document.getElementById('status-filter');

    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.filterJobListings();
      }, 300));
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        this.filterJobListings();
      });
    }
  }

  setupCandidateFilters() {
    const searchInput = document.getElementById('candidate-search');
    const jobFilter = document.getElementById('job-filter');
    const statusFilter = document.getElementById('status-filter-candidates');

    [searchInput, jobFilter, statusFilter].forEach(element => {
      if (element) {
        const eventType = element.type === 'text' ? 'input' : 'change';
        element.addEventListener(eventType, this.debounce(() => {
          this.filterCandidates();
        }, element.type === 'text' ? 300 : 0));
      }
    });
  }

  filterJobListings() {
    const search = document.getElementById('job-search')?.value.toLowerCase() || '';
    const status = document.getElementById('status-filter')?.value || 'all';

    // Trigger filtering in job manager
    window.recruiterJobManager?.filterJobs(search, status);
  }

  filterCandidates() {
    const search = document.getElementById('candidate-search')?.value.toLowerCase() || '';
    const job = document.getElementById('job-filter')?.value || 'all';
    const status = document.getElementById('status-filter-candidates')?.value || 'all';

    // Trigger filtering in candidate manager
    window.recruiterCandidateManager?.filterCandidates(search, job, status);
  }

  loadCompanyProfileData() {
    // Load saved company profile data
    const savedProfile = localStorage.getItem('recruiter_company_profile');
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        this.populateCompanyForm(profileData);
      } catch (error) {
        console.error('Error loading company profile:', error);
      }
    }
  }

  populateCompanyForm(data) {
    Object.keys(data).forEach(key => {
      const input = document.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = data[key];
        } else {
          input.value = data[key];
        }
      }
    });
  }

  setupLogoUpload() {
    const logoInput = document.getElementById('company-logo');
    if (logoInput) {
      logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.previewLogo(file);
        }
      });
    }
  }

  previewLogo(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const logoImg = document.getElementById('logo-img');
      const logoPreview = document.getElementById('logo-preview');
      const logoPlaceholder = document.getElementById('logo-placeholder');
      
      if (logoImg && logoPreview && logoPlaceholder) {
        logoImg.src = e.target.result;
        logoPreview.classList.remove('hidden');
        logoPlaceholder.classList.add('hidden');
      }
    };
    reader.readAsDataURL(file);
  }

  // Utility function for debouncing
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

  // Public API for external access
  getCurrentTab() {
    return this.activeTab;
  }

  getTabHistory() {
    return this.tabHistory || [];
  }
}

// Initialize and expose globally
window.recruiterTabManager = new RecruiterTabManager();