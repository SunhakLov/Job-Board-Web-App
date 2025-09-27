// Recruiter Job Manager
class RecruiterJobManager {
  constructor() {
    this.jobs = [];
    this.filteredJobs = [];
    this.currentFilters = {
      search: '',
      status: 'all'
    };
    this.init();
  }

  init() {
    this.loadJobsFromStorage();
    this.bindEvents();
    this.startApplicationSimulation(); // Simulate new applications
  }

  bindEvents() {
    // Post job form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'post-job-form') {
        e.preventDefault();
        this.handleJobSubmission(e.target);
      }
    });

    // Job action buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="edit-job"]')) {
        this.editJob(e.target.dataset.jobId);
      }
      
      if (e.target.matches('[data-action="delete-job"]')) {
        this.deleteJob(e.target.dataset.jobId);
      }
      
      if (e.target.matches('[data-action="pause-job"]')) {
        this.pauseJob(e.target.dataset.jobId);
      }
      
      if (e.target.matches('[data-action="resume-job"]')) {
        this.resumeJob(e.target.dataset.jobId);
      }
      
      if (e.target.matches('[data-action="close-job"]')) {
        this.closeJob(e.target.dataset.jobId);
      }
      
      if (e.target.matches('[data-action="view-candidates"]')) {
        this.viewJobCandidates(e.target.dataset.jobId);
      }
    });
  }

  async handleJobSubmission(form) {
    const formData = new FormData(form);
    const jobData = this.processJobFormData(formData);

    try {
      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Posting Job...';
      submitButton.disabled = true;

      // Simulate API call
      const result = await this.simulateJobPost(jobData);
      
      if (result.success) {
        // Add to jobs list
        this.addJob(result.job);
        
        // Clear form and draft
        form.reset();
        localStorage.removeItem('recruiter_job_draft');
        
        // Show success message
        window.recruiterToastManager?.show('Job posted successfully!', 'success');
        
        // Switch to job listings tab
        setTimeout(() => {
          window.recruiterTabManager?.switchTab('job-listings');
        }, 1500);
        
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      window.recruiterToastManager?.show(error.message, 'error');
    } finally {
      // Reset button state
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  processJobFormData(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Process skills
    if (data.skills) {
      data.skills = data.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    } else {
      data.skills = [];
    }

    // Add metadata
    data.id = Date.now().toString();
    data.status = 'active';
    data.postedDate = new Date().toISOString().split('T')[0];
    data.applications = 0;
    data.views = 0;
    data.recruiterInfo = window.recruiterAuth?.currentUser;

    // Calculate application deadline if not provided
    if (!data.applicationDeadline) {
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + 1);
      data.applicationDeadline = deadline.toISOString().split('T')[0];
    }

    return data;
  }

  async simulateJobPost(jobData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful posting
        resolve({
          success: true,
          job: {
            ...jobData,
            applications: Math.floor(Math.random() * 10),
            views: Math.floor(Math.random() * 50) + 10
          }
        });
      }, 2000);
    });
  }

  addJob(job) {
    this.jobs.unshift(job); // Add to beginning of array
    this.saveJobsToStorage();
    this.updateJobListings();
    
    // Trigger notification for new job posting
    if (window.recruiterNotificationManager) {
      window.recruiterNotificationManager.addNotification(
        'job_posted',
        'Job Posted Successfully',
        `${job.jobTitle} has been posted and is now live`,
        { jobId: job.id }
      );
    }
  }

  loadJobsFromStorage() {
    const savedJobs = localStorage.getItem('recruiter_jobs');
    if (savedJobs) {
      try {
        this.jobs = JSON.parse(savedJobs);
      } catch (error) {
        console.error('Error loading jobs from storage:', error);
        this.jobs = this.getDefaultJobs();
      }
    } else {
      this.jobs = this.getDefaultJobs();
    }
    
    this.filteredJobs = [...this.jobs];
  }

  saveJobsToStorage() {
    try {
      localStorage.setItem('recruiter_jobs', JSON.stringify(this.jobs));
    } catch (error) {
      console.error('Error saving jobs to storage:', error);
    }
  }

  getDefaultJobs() {
    // Default demo jobs
    return [
      {
        id: '1',
        jobTitle: 'Senior Frontend Developer',
        department: 'engineering',
        employmentType: 'full-time',
        location: 'San Francisco, CA',
        salaryMin: 100000,
        salaryMax: 140000,
        currency: 'USD',
        jobDescription: 'We are looking for a Senior Frontend Developer to join our growing engineering team. You will be responsible for building user-facing features using modern React and TypeScript.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience with React, TypeScript, and modern web technologies.',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        applicationDeadline: '2024-12-31',
        experienceLevel: 'senior',
        remoteFriendly: false,
        status: 'active',
        postedDate: '2024-12-05',
        applications: 28,
        views: 145,
        inReview: 12,
        interviews: 5,
        offers: 2
      },
      {
        id: '2',
        jobTitle: 'UX Designer',
        department: 'design',
        employmentType: 'full-time',
        location: 'Remote',
        salaryMin: 80000,
        salaryMax: 110000,
        currency: 'USD',
        jobDescription: 'Join our design team to create exceptional user experiences. You\'ll work closely with product managers and engineers to design intuitive interfaces.',
        requirements: 'Bachelor\'s degree in Design or related field. 3+ years of UX design experience with strong portfolio.',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        applicationDeadline: '2024-12-25',
        experienceLevel: 'mid',
        remoteFriendly: true,
        status: 'paused',
        postedDate: '2024-11-28',
        applications: 15,
        views: 89,
        inReview: 8,
        interviews: 2,
        offers: 0
      },
      {
        id: '3',
        jobTitle: 'Data Science Intern',
        department: 'engineering',
        employmentType: 'internship',
        location: 'New York, NY',
        salaryMin: 25,
        salaryMax: 25,
        currency: 'USD',
        jobDescription: 'Summer internship opportunity for data science students. Work on real-world machine learning projects.',
        requirements: 'Currently pursuing degree in Data Science, Computer Science, or related field.',
        skills: ['Python', 'SQL', 'Machine Learning', 'Pandas'],
        applicationDeadline: '2025-02-15',
        experienceLevel: 'entry',
        remoteFriendly: false,
        status: 'draft',
        postedDate: '2024-12-08',
        applications: 0,
        views: 0,
        inReview: 0,
        interviews: 0,
        offers: 0
      }
    ];
  }

  loadJobListings() {
    this.updateJobListings();
  }

  updateJobListings() {
    const container = document.getElementById('job-listings-container');
    const noJobsMessage = document.getElementById('no-jobs-message');
    
    if (!container) return;

    if (this.filteredJobs.length === 0) {
      container.style.display = 'none';
      if (noJobsMessage) {
        noJobsMessage.classList.remove('hidden');
      }
      return;
    }

    container.style.display = 'block';
    if (noJobsMessage) {
      noJobsMessage.classList.add('hidden');
    }

    container.innerHTML = this.filteredJobs.map(job => this.generateJobListingHTML(job)).join('');
  }

  generateJobListingHTML(job) {
    const statusBadgeClass = this.getStatusBadgeClass(job.status);
    const statusText = this.getStatusText(job.status);
    const formattedSalary = this.formatSalary(job);
    const daysAgo = this.getDaysAgo(job.postedDate);
    const skillTags = job.skills?.slice(0, 3).map(skill => 
      `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${skill}</span>`
    ).join('') || '';

    return `
      <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h4 class="text-lg font-semibold text-gray-900">${job.jobTitle}</h4>
              <span class="ml-3 px-2 py-1 ${statusBadgeClass} text-xs font-medium rounded-full">${statusText}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 space-x-4 mb-2">
              <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
              <span><i class="fas fa-briefcase mr-1"></i>${job.employmentType}</span>
              <span><i class="fas fa-dollar-sign mr-1"></i>${formattedSalary}</span>
            </div>
            <p class="text-gray-600 text-sm">${this.getJobDateText(job, daysAgo)}</p>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button class="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                    data-action="edit-job" data-job-id="${job.id}" title="Edit Job">
              <i class="fas fa-edit"></i>
            </button>
            <button class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    data-action="delete-job" data-job-id="${job.id}" title="Delete Job">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">${job.applications || 0}</div>
            <div class="text-xs text-gray-500">Applications</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">${job.inReview || 0}</div>
            <div class="text-xs text-gray-500">In Review</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">${job.interviews || 0}</div>
            <div class="text-xs text-gray-500">Interviews</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">${job.offers || 0}</div>
            <div class="text-xs text-gray-500">Offers</div>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex space-x-2">
            ${skillTags}
          </div>
          <div class="flex space-x-2">
            ${this.generateActionButtons(job)}
          </div>
        </div>
      </div>
    `;
  }

  generateActionButtons(job) {
    let buttons = [];

    if (job.applications > 0) {
      buttons.push(`
        <button class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                data-action="view-candidates" data-job-id="${job.id}">
          View Candidates
        </button>
      `);
    }

    if (job.status === 'active') {
      buttons.push(`
        <button class="px-4 py-2 text-sm border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
                data-action="pause-job" data-job-id="${job.id}">
          Pause
        </button>
      `);
    } else if (job.status === 'paused') {
      buttons.push(`
        <button class="px-4 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-200"
                data-action="resume-job" data-job-id="${job.id}">
          Resume Posting
        </button>
      `);
    } else if (job.status === 'draft') {
      buttons.push(`
        <button class="px-4 py-2 text-sm border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                data-action="edit-job" data-job-id="${job.id}">
          Complete & Publish
        </button>
      `);
    }

    buttons.push(`
      <button class="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              data-action="edit-job" data-job-id="${job.id}">
        ${job.status === 'draft' ? 'Edit Draft' : 'View Details'}
      </button>
    `);

    return buttons.join('');
  }

  getStatusBadgeClass(status) {
    const classes = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return classes[status] || classes.active;
  }

  getStatusText(status) {
    const texts = {
      active: 'Active',
      paused: 'Paused',
      closed: 'Closed',
      draft: 'Draft'
    };
    return texts[status] || 'Active';
  }

  formatSalary(job) {
    if (!job.salaryMin && !job.salaryMax) return 'Not specified';
    
    if (job.employmentType === 'internship' || job.salaryMin < 100) {
      return `$${job.salaryMin}/hour`;
    }
    
    if (job.salaryMin && job.salaryMax) {
      return `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`;
    }
    
    return `$${((job.salaryMin || job.salaryMax) / 1000).toFixed(0)}k+`;
  }

  getDaysAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getJobDateText(job, daysAgo) {
    if (job.status === 'draft') {
      return `Created ${daysAgo} days ago • Not published`;
    }
    
    if (job.status === 'paused') {
      return `Posted ${daysAgo} days ago • Paused`;
    }
    
    if (job.status === 'closed') {
      return `Posted ${daysAgo} days ago • Closed`;
    }
    
    const deadlineDays = this.getDaysUntilDeadline(job.applicationDeadline);
    return `Posted ${daysAgo} days ago • Expires in ${deadlineDays} days`;
  }

  getDaysUntilDeadline(dateString) {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  filterJobs(searchTerm, statusFilter) {
    this.currentFilters.search = searchTerm;
    this.currentFilters.status = statusFilter;
    
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.jobTitle.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.department.toLowerCase().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    this.updateJobListings();
  }

  // Job actions
  editJob(jobId) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Populate the post job form with existing data
    this.populateJobForm(job);
    window.recruiterTabManager?.switchTab('post-job');
  }

  populateJobForm(job) {
    const form = document.getElementById('post-job-form');
    if (!form) return;
    
    // Populate form fields
    Object.keys(job).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = job[key];
        } else if (key === 'skills' && Array.isArray(job[key])) {
          input.value = job[key].join(', ');
        } else {
          input.value = job[key];
        }
      }
    });
    
    // Store job ID for update
    form.dataset.editingJobId = job.id;
  }

  async deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    this.jobs = this.jobs.filter(job => job.id !== jobId);
    this.saveJobsToStorage();
    this.filterJobs(this.currentFilters.search, this.currentFilters.status);
    
    window.recruiterToastManager?.show('Job deleted successfully', 'success');
  }

  pauseJob(jobId) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'paused';
      this.saveJobsToStorage();
      this.updateJobListings();
      window.recruiterToastManager?.show('Job paused successfully', 'success');
      
      // Add notification
      if (window.recruiterNotificationManager) {
        window.recruiterNotificationManager.addNotification(
          'job_paused',
          'Job Paused',
          `${job.jobTitle} has been paused`,
          { jobId: job.id }
        );
      }
    }
  }

  resumeJob(jobId) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'active';
      this.saveJobsToStorage();
      this.updateJobListings();
      window.recruiterToastManager?.show('Job resumed successfully', 'success');
      
      // Add notification
      if (window.recruiterNotificationManager) {
        window.recruiterNotificationManager.addNotification(
          'job_resumed',
          'Job Resumed',
          `${job.jobTitle} is now active again`,
          { jobId: job.id }
        );
      }
    }
  }

  closeJob(jobId) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'closed';
      this.saveJobsToStorage();
      this.updateJobListings();
      window.recruiterToastManager?.show('Job closed successfully', 'success');
      
      // Add notification
      if (window.recruiterNotificationManager) {
        window.recruiterNotificationManager.addNotification(
          'job_closed',
          'Job Closed',
          `${job.jobTitle} has been closed to new applications`,
          { jobId: job.id }
        );
      }
    }
  }

  viewJobCandidates(jobId) {
    // Switch to candidates tab and filter by this job
    window.recruiterTabManager?.switchTab('candidates');
    
    // Set job filter
    setTimeout(() => {
      const jobFilter = document.getElementById('job-filter');
      if (jobFilter) {
        jobFilter.value = jobId;
        jobFilter.dispatchEvent(new Event('change'));
      }
    }, 100);
  }

  // Public API
  getJobs() {
    return this.jobs;
  }

  getJob(jobId) {
    return this.jobs.find(job => job.id === jobId);
  }

  getJobStats() {
    return {
      total: this.jobs.length,
      active: this.jobs.filter(j => j.status === 'active').length,
      paused: this.jobs.filter(j => j.status === 'paused').length,
      draft: this.jobs.filter(j => j.status === 'draft').length,
      closed: this.jobs.filter(j => j.status === 'closed').length
    };
  }

  // Simulate new applications for active jobs
  startApplicationSimulation() {
    setInterval(() => {
      const activeJobs = this.jobs.filter(j => j.status === 'active');
      if (activeJobs.length > 0 && Math.random() > 0.85) { // 15% chance every interval
        const randomJob = activeJobs[Math.floor(Math.random() * activeJobs.length)];
        this.simulateNewApplication(randomJob);
      }
    }, 30000); // Check every 30 seconds
  }

  simulateNewApplication(job) {
    // Increment application count
    job.applications = (job.applications || 0) + 1;
    job.views = (job.views || 0) + Math.floor(Math.random() * 3) + 1;
    
    // Save updated job data
    this.saveJobsToStorage();
    this.updateJobListings();
    
    // Create notification
    const applicantNames = [
      'Sarah Johnson', 'Mike Davis', 'Emily Chen', 'David Rodriguez', 'Lisa Wang',
      'Chris Anderson', 'Maria Garcia', 'John Smith', 'Anna Lee', 'Tom Wilson'
    ];
    
    const applicantName = applicantNames[Math.floor(Math.random() * applicantNames.length)];
    
    if (window.recruiterNotificationManager) {
      window.recruiterNotificationManager.addNotification(
        'new_application',
        'New Application Received',
        `${applicantName} applied for ${job.jobTitle}`,
        { jobId: job.id, applicantName }
      );
    }
  }
}

// Initialize and expose globally
window.recruiterJobManager = new RecruiterJobManager();