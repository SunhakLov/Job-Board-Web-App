/* ===== JOB BOARD JAVASCRIPT ===== */

// Job details data structure
const jobDetails = {
  frontend: {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    posted: '2 days ago',
    description: 'We are looking for a talented Senior Frontend Developer to join our dynamic team. You will be responsible for building modern, responsive web interfaces using cutting-edge technologies.',
    requirements: [
      '5+ years of experience in frontend development',
      'Expert knowledge of React, TypeScript, and modern JavaScript',
      'Experience with Tailwind CSS and responsive design',
      'Familiarity with REST APIs and GraphQL',
      'Experience with testing frameworks (Jest, Cypress)',
      'Strong understanding of web performance optimization'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible working hours and remote work options',
      'Professional development budget',
      'Modern office with free meals and snacks'
    ]
  },
  backend: {
    title: 'Backend Engineer',
    company: 'DataFlow Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100k - $130k',
    posted: '1 week ago',
    description: 'Join our backend team to design and implement scalable APIs and cloud infrastructure solutions that power our data processing platform.',
    requirements: [
      '3+ years of backend development experience',
      'Proficiency in Node.js, Python, or Java',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Knowledge of database design and optimization',
      'Experience with containerization (Docker, Kubernetes)',
      'Understanding of microservices architecture'
    ],
    benefits: [
      'Competitive salary with performance bonuses',
      'Health insurance and 401k matching',
      'Flexible PTO and work-from-home options',
      'Learning and development opportunities',
      'Team building events and company retreats'
    ]
  },
  designer: {
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Los Angeles, CA',
    type: 'Contract',
    salary: '$80k - $100k',
    posted: '3 days ago',
    description: 'We are seeking a creative UI/UX Designer to craft intuitive and engaging user experiences for our web and mobile applications.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma, Sketch, and Adobe Creative Suite',
      'Strong portfolio demonstrating design process',
      'Experience with user research and usability testing',
      'Knowledge of design systems and accessibility standards',
      'Excellent communication and collaboration skills'
    ],
    benefits: [
      'Competitive contract rate',
      'Flexible working arrangements',
      'Creative freedom and autonomy',
      'Opportunity to work on diverse projects',
      'Potential for full-time conversion'
    ]
  }
};

// Application class for better organization
class JobBoardApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFileUpload();
    this.setupAnimations();
  }

  setupEventListeners() {
    // Form submission
    const jobForm = document.getElementById('jobAppForm');
    if (jobForm) {
      jobForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // Modal close on outside click
    const modal = document.getElementById('jobModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    // Favorite button interactions
    this.setupFavoriteButtons();

    // Search functionality
    this.setupSearchFunctionality();
  }

  setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('i');
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
          btn.classList.add('text-red-500');
          this.showToast('Job saved to favorites!', 'success');
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
          btn.classList.remove('text-red-500');
          this.showToast('Job removed from favorites', 'info');
        }
      });
    });
  }

  setupSearchFunctionality() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const locationInput = document.querySelector('.search-location');

    if (searchButton) {
      searchButton.addEventListener('click', () => {
        const query = searchInput?.value || '';
        const location = locationInput?.value || '';
        this.performSearch(query, location);
      });
    }

    // Enter key support
    [searchInput, locationInput].forEach(input => {
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const query = searchInput?.value || '';
            const location = locationInput?.value || '';
            this.performSearch(query, location);
          }
        });
      }
    });
  }

  performSearch(query, location) {
    // Simulate search functionality
    this.showToast(`Searching for "${query}" in "${location}"...`, 'info');
    
    // In a real app, this would make an API call
    setTimeout(() => {
      this.showToast('Search completed! Showing relevant results.', 'success');
    }, 1500);
  }

  setupFileUpload() {
    const fileInput = document.getElementById('resume');
    const dropZone = fileInput?.parentElement;
    
    if (!fileInput || !dropZone) return;

    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag and drop functionality
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        this.updateFileName(files[0].name);
      }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.updateFileName(e.target.files[0].name);
      }
    });
  }

  updateFileName(name) {
    const dropZone = document.querySelector('.file-upload-zone');
    const textElement = dropZone?.querySelector('.file-upload-text');
    if (textElement) {
      textElement.innerHTML = `<span class="text-green-600"><i class="fas fa-check mr-1"></i>${name}</span>`;
    }
  }

  setupAnimations() {
    // Add intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe job cards for scroll animations
    document.querySelectorAll('.job-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // Show job details modal
  showDetails(jobKey) {
    const modal = document.getElementById('jobModal');
    const content = document.getElementById('modalContent');
    const job = jobDetails[jobKey];
    
    if (!job || !modal || !content) return;

    content.innerHTML = this.generateJobDetailHTML(job);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.95)';
    modalContent.style.opacity = '0';
    
    requestAnimationFrame(() => {
      modalContent.style.transition = 'all 0.3s ease';
      modalContent.style.transform = 'scale(1)';
      modalContent.style.opacity = '1';
    });
  }

  generateJobDetailHTML(job) {
    return `
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">${job.title}</h2>
        <div class="flex items-center space-x-4 text-gray-600 mb-4">
          <span><i class="fas fa-building mr-1"></i>${job.company}</span>
          <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
          <span><i class="fas fa-clock mr-1"></i>${job.posted}</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="status-badge status-fulltime">${job.type}</span>
          <span class="status-badge bg-green-100 text-green-800">${job.salary}</span>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
        <p class="text-gray-700 mb-4 leading-relaxed">${job.description}</p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          ${job.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
      
      <div class="flex space-x-3">
        <button class="flex-1 btn-primary text-white py-3 rounded-lg font-medium">
          <i class="fas fa-paper-plane mr-2"></i>Apply Now
        </button>
        <button class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
          <i class="far fa-heart"></i>
        </button>
        <button class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
          <i class="fas fa-share"></i>
        </button>
      </div>
    `;
  }

  // Close modal
  closeModal() {
    const modal = document.getElementById('jobModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.95)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 200);
  }

  // Handle form submission
  handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!this.validateForm(data)) {
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i>Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.showSuccessMessage();
      e.target.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Reset file upload display
      const fileText = document.querySelector('.file-upload-text');
      if (fileText) {
        fileText.innerHTML = 'Drop your resume here or <span class="text-blue-600 cursor-pointer">browse</span>';
      }
    }, 2000);
  }

  validateForm(data) {
    const required = ['name', 'email', 'position'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      this.showToast(`Please fill in: ${missing.join(', ')}`, 'error');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showToast('Please enter a valid email address', 'error');
      return false;
    }

    return true;
  }

  showSuccessMessage() {
    const successDiv = document.getElementById('formSuccess');
    if (successDiv) {
      successDiv.classList.remove('hidden');
      setTimeout(() => {
        successDiv.classList.add('hidden');
      }, 4000);
    }
  }

  showToast(message, type = 'info') {
    const toast = this.createToast(message, type);
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };

    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transform translate-x-full opacity-0 transition-all duration-300`;
    toast.innerHTML = `
      <i class="${icons[type]}"></i>
      <span>${message}</span>
    `;
    
    return toast;
  }
}

// Global functions for onclick handlers
function showDetails(jobKey) {
  if (window.jobBoardApp) {
    window.jobBoardApp.showDetails(jobKey);
  }
}

function closeModal() {
  if (window.jobBoardApp) {
    window.jobBoardApp.closeModal();
  }
}

// Additional utility functions
const Utils = {
  // Debounce function for search
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
  },

  // Format salary range
  formatSalary(min, max) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  },

  // Time ago helper
  timeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.jobBoardApp = new JobBoardApp();
  
  // Add some additional interactive features
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      console.log(`Filter changed: ${e.target.value}`);
      // In a real app, this would trigger a search/filter operation
    });
  });

  // Add loading states to job cards
  const jobCards = document.querySelectorAll('.job-card');
  jobCards.forEach((card, index) => {
    // Stagger the animation
    card.style.animationDelay = `${index * 0.1}s`;
  });
});