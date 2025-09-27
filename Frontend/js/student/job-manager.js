// Job Manager Module
class JobManager {
  constructor() {
    this.jobs = [];
    this.savedJobs = [];
    this.applications = [];
    this.init();
  }

  init() {
    this.loadSampleData();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Search functionality
    const searchBtn = document.querySelector('#searchTab button[class*="bg-gradient"]');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.performSearch());
    }
  }

  loadSampleData() {
    // Sample job data
    this.jobs = [
      {
        id: 1,
        title: 'Software Engineering Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        type: 'Internship',
        workType: 'Remote',
        salary: '$40/hour',
        description: 'Join our team for a summer internship working on cutting-edge web technologies. You\'ll collaborate with senior engineers on real projects that impact millions of users.',
        posted: '3 days ago',
        applicants: '50+',
        icon: 'fas fa-code',
        color: 'blue'
      },
      {
        id: 2,
        title: 'Marketing Co-op',
        company: 'Microsoft',
        location: 'Seattle, WA',
        type: 'Co-op',
        workType: 'Hybrid',
        salary: '$35/hour',
        description: '6-month co-op program focusing on digital marketing campaigns, data analysis, and market research. Perfect for marketing or business students.',
        posted: '5 days ago',
        applicants: '25+',
        icon: 'fas fa-chart-line',
        color: 'green'
      },
      {
        id: 3,
        title: 'UX Design Intern',
        company: 'Adobe',
        location: 'San Jose, CA',
        type: 'Internship',
        workType: 'Remote',
        salary: '$38/hour',
        description: 'Create intuitive user experiences for Creative Cloud applications. Work alongside senior designers and researchers to improve user workflows.',
        posted: '1 week ago',
        applicants: '100+',
        icon: 'fas fa-palette',
        color: 'purple'
      }
    ];

    // Sample applications data
    this.applications = [
      {
        id: 1,
        jobId: 1,
        status: 'Under Review',
        appliedDate: 'Dec 20, 2024',
        progress: 50,
        progressSteps: [
          { name: 'Applied', completed: true },
          { name: 'Resume Reviewed', completed: true },
          { name: 'Phone Screen', completed: false },
          { name: 'Final Interview', completed: false }
        ]
      },
      {
        id: 2,
        jobId: 2,
        status: 'Interview Scheduled',
        appliedDate: 'Dec 18, 2024',
        interviewDate: 'December 28, 2024 at 2:00 PM PST',
        progress: 75
      }
    ];

    this.renderJobs();
    this.renderApplications();
  }

  renderJobs() {
    const container = document.getElementById('jobListings');
    if (!container) return;

    container.innerHTML = this.jobs.map(job => this.createJobCard(job)).join('');
  }

  createJobCard(job) {
    return `
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-${job.color}-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="${job.icon} text-${job.color}-600"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${job.title}</h3>
                <p class="text-gray-600 mb-2">${job.company}</p>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">${job.type}</span>
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">${job.workType}</span>
                  <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">${job.salary}</span>
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
              <button onclick="jobManager.saveJob(${job.id})" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button onclick="jobManager.applyToJob(${job.id})" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Apply
              </button>
            </div>
          </div>
          <p class="text-gray-600 mb-4">${job.description}</p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center space-x-4">
              <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
              <span><i class="fas fa-clock mr-1"></i>${job.posted}</span>
              <span><i class="fas fa-users mr-1"></i>${job.applicants} applicants</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderApplications() {
    const container = document.getElementById('applicationsList');
    if (!container) return;

    container.innerHTML = this.applications.map(app => {
      const job = this.jobs.find(j => j.id === app.jobId);
      return this.createApplicationCard(app, job);
    }).join('');
  }

  createApplicationCard(application, job) {
    const statusColors = {
      'Under Review': 'yellow',
      'Interview Scheduled': 'green',
      'Not Selected': 'red',
      'Accepted': 'green'
    };

    const color = statusColors[application.status] || 'gray';

    return `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-${job.color}-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="${job.icon} text-${job.color}-600"></i>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-900 mb-1">${job.title}</h4>
              <p class="text-gray-600 mb-2">${job.company}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span><i class="fas fa-calendar mr-1"></i>Applied: ${application.appliedDate}</span>
                <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm font-medium">
              <i class="fas fa-clock mr-1"></i>${application.status}
            </span>
          </div>
        </div>
        
        ${application.progress ? `
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Application Progress</span>
              <span class="text-sm text-gray-500">${Math.floor(application.progress / 25)} of 4 steps completed</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: ${application.progress}%"></div>
            </div>
            ${application.progressSteps ? `
              <div class="flex justify-between mt-2 text-xs text-gray-500">
                ${application.progressSteps.map(step => 
                  `<span class="${step.completed ? 'text-blue-600' : ''}">${step.name}${step.completed ? ' ✓' : ''}</span>`
                ).join('')}
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${application.interviewDate ? `
          <div class="bg-green-50 rounded-lg p-4 mb-4">
            <div class="flex items-center mb-2">
              <i class="fas fa-calendar-check text-green-600 mr-2"></i>
              <span class="font-medium text-green-900">Interview Scheduled</span>
            </div>
            <p class="text-green-800 text-sm">${application.interviewDate}</p>
            <p class="text-green-700 text-sm">Virtual meeting - Link will be sent 30 minutes before</p>
          </div>
        ` : ''}
        
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-${color}-50 text-${color}-600 rounded-lg hover:bg-${color}-100 transition-colors">
            View Details
          </button>
          <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            ${application.status === 'Interview Scheduled' ? 'Reschedule' : 'Withdraw Application'}
          </button>
        </div>
      </div>
    `;
  }

  saveJob(jobId) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;

    const index = this.savedJobs.findIndex(j => j.id === jobId);
    if (index === -1) {
      this.savedJobs.push(job);
      window.toastManager?.show('Job saved successfully!', 'success');
    } else {
      this.savedJobs.splice(index, 1);
      window.toastManager?.show('Job removed from saved list.', 'info');
    }

    this.renderSavedJobs();
  }

  applyToJob(jobId) {
    if (!window.authManager?.isLoggedIn) {
      window.authManager?.showModal('login');
      return;
    }

    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;

    // Check if already applied
    const existingApplication = this.applications.find(app => app.jobId === jobId);
    if (existingApplication) {
      window.toastManager?.show('You have already applied to this job.', 'warning');
      return;
    }

    // Add new application
    const newApplication = {
      id: Date.now(),
      jobId: jobId,
      status: 'Under Review',
      appliedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      progress: 25,
      progressSteps: [
        { name: 'Applied', completed: true },
        { name: 'Resume Reviewed', completed: false },
        { name: 'Phone Screen', completed: false },
        { name: 'Final Interview', completed: false }
      ]
    };

    this.applications.push(newApplication);
    this.renderApplications();
    window.toastManager?.show('Application submitted successfully!', 'success');
  }

  renderSavedJobs() {
    const container = document.getElementById('savedJobsList');
    if (!container) return;

    if (this.savedJobs.length === 0) {
      container.innerHTML = `
        <div class="p-6 text-center text-gray-500">
          <i class="fas fa-heart text-4xl mb-4"></i>
          <p>No saved jobs yet. Start browsing and save jobs you're interested in!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.savedJobs.map(job => `
      <div class="p-6">
        <div class="flex justify-between items-start">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-${job.color}-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="${job.icon} text-${job.color}-600"></i>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-900 mb-1">${job.title}</h4>
              <p class="text-gray-600 mb-2">${job.company}</p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">${job.type}</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">${job.workType}</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">${job.salary}</span>
              </div>
              <p class="text-gray-600 text-sm mb-2">${job.description}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
                <span><i class="fas fa-bookmark mr-1"></i>Saved</span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button onclick="jobManager.saveJob(${job.id})" class="p-2 text-red-500 hover:text-red-700 transition-colors">
              <i class="fas fa-heart"></i>
            </button>
            <button onclick="jobManager.applyToJob(${job.id})" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  performSearch() {
    // Simulate search functionality
    window.toastManager?.show('Searching for jobs...', 'info');
    
    setTimeout(() => {
      window.toastManager?.show('Search completed! Showing relevant results.', 'success');
    }, 1500);
  }
}

// Export for global use
window.JobManager = JobManager;