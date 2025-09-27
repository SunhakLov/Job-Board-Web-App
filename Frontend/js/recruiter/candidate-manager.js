// Recruiter Candidate Manager
class RecruiterCandidateManager {
  constructor() {
    this.candidates = [];
    this.filteredCandidates = [];
    this.currentFilters = {
      search: '',
      job: 'all',
      status: 'all'
    };
    this.selectedCandidates = new Set();
    this.init();
  }

  init() {
    this.loadCandidatesFromStorage();
    this.bindEvents();
  }

  bindEvents() {
    // Candidate action buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="view-resume"]')) {
        this.viewResume(e.target.dataset.candidateId);
      }
      
      if (e.target.matches('[data-action="schedule-interview"]')) {
        this.scheduleInterview(e.target.dataset.candidateId);
      }
      
      if (e.target.matches('[data-action="reject-candidate"]')) {
        this.rejectCandidate(e.target.dataset.candidateId);
      }
      
      if (e.target.matches('[data-action="send-offer"]')) {
        this.sendOffer(e.target.dataset.candidateId);
      }
      
      if (e.target.matches('[data-action="follow-up"]')) {
        this.followUp(e.target.dataset.candidateId);
      }
      
      if (e.target.matches('[data-action="view-details"]')) {
        this.viewCandidateDetails(e.target.dataset.candidateId);
      }
      
      if (e.target.matches('[data-action="reschedule"]')) {
        this.rescheduleInterview(e.target.dataset.candidateId);
      }

      // Candidate selection
      if (e.target.type === 'checkbox' && e.target.classList.contains('candidate-checkbox')) {
        this.handleCandidateSelection(e.target);
      }

      // Bulk actions
      if (e.target.matches('[data-bulk-action]')) {
        this.handleBulkAction(e.target.dataset.bulkAction);
      }
    });

    // Select all checkbox
    document.addEventListener('change', (e) => {
      if (e.target.id === 'select-all-candidates') {
        this.toggleSelectAll(e.target.checked);
      }
    });
  }

  loadCandidatesFromStorage() {
    const savedCandidates = localStorage.getItem('recruiter_candidates');
    if (savedCandidates) {
      try {
        this.candidates = JSON.parse(savedCandidates);
      } catch (error) {
        console.error('Error loading candidates from storage:', error);
        this.candidates = this.getDefaultCandidates();
      }
    } else {
      this.candidates = this.getDefaultCandidates();
    }
    
    this.filteredCandidates = [...this.candidates];
  }

  saveCandidatesToStorage() {
    try {
      localStorage.setItem('recruiter_candidates', JSON.stringify(this.candidates));
    } catch (error) {
      console.error('Error saving candidates to storage:', error);
    }
  }

  getDefaultCandidates() {
    // Default demo candidates
    return [
      {
        id: '1',
        fullName: 'Sarah Martinez',
        email: 'sarah.martinez@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        status: 'new',
        appliedDate: '2024-12-10',
        experience: '5+ years',
        education: 'Stanford University',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
        matchScore: 95,
        resumeUrl: '#',
        portfolioUrl: 'https://sarahmartinez.dev',
        bio: '5+ years experience in frontend development. Previously worked at Google and Microsoft. Strong background in React ecosystem and modern web technologies.',
        previousCompanies: ['Google', 'Microsoft', 'Airbnb'],
        salaryExpectation: 130000,
        availability: 'immediate',
        notes: []
      },
      {
        id: '2',
        fullName: 'Michael Johnson',
        email: 'm.johnson@email.com',
        phone: '(555) 987-6543',
        location: 'Remote',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        status: 'interview',
        appliedDate: '2024-12-07',
        experience: '7 years',
        education: 'UC Berkeley',
        skills: ['React', 'Vue.js', 'JavaScript', 'Docker'],
        matchScore: 88,
        resumeUrl: '#',
        portfolioUrl: 'https://michaeljohnson.com',
        bio: '7 years of frontend development experience. Led multiple projects at startup companies. Expertise in modern JavaScript frameworks and agile methodologies.',
        previousCompanies: ['Startup Inc', 'Tech Solutions', 'Innovation Lab'],
        salaryExpectation: 125000,
        availability: '2 weeks notice',
        interviewDate: '2024-12-15',
        interviewTime: '2:00 PM PST',
        interviewType: 'Technical interview with the engineering team',
        notes: [
          { date: '2024-12-08', note: 'Strong technical background, good cultural fit', author: 'HR Team' },
          { date: '2024-12-09', note: 'Scheduled for technical interview', author: 'Sarah Johnson' }
        ]
      },
      {
        id: '3',
        fullName: 'Emily Liu',
        email: 'emily.liu@email.com',
        phone: '(555) 456-7890',
        location: 'Seattle, WA',
        jobId: '2',
        jobTitle: 'UX Designer',
        status: 'offer',
        appliedDate: '2024-12-03',
        experience: '6 years',
        education: 'RISD',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping'],
        matchScore: 92,
        resumeUrl: '#',
        portfolioUrl: 'https://emilyliu.design',
        bio: 'Senior UX designer with 6 years experience at design-focused companies. Strong portfolio in mobile and web design. Led design systems at previous role.',
        previousCompanies: ['Design Studio', 'Creative Agency', 'UX Firm'],
        salaryExpectation: 105000,
        availability: '1 month notice',
        offerAmount: 105000,
        offerExpiry: '2024-12-20',
        offerStatus: 'pending',
        notes: [
          { date: '2024-12-04', note: 'Excellent portfolio and design thinking', author: 'Design Team' },
          { date: '2024-12-09', note: 'Offer extended - awaiting response', author: 'Sarah Johnson' },
          { date: '2024-12-10', note: 'Candidate considering offer, follow up scheduled', author: 'HR Team' }
        ]
      },
      {
        id: '4',
        fullName: 'David Chen',
        email: 'david.chen@email.com',
        phone: '(555) 321-9876',
        location: 'Austin, TX',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        status: 'reviewing',
        appliedDate: '2024-12-09',
        experience: '4 years',
        education: 'UT Austin',
        skills: ['React', 'Angular', 'TypeScript', 'Python'],
        matchScore: 82,
        resumeUrl: '#',
        portfolioUrl: 'https://davidchen.tech',
        bio: 'Frontend developer with full-stack experience. Strong problem-solving skills and passion for creating user-friendly interfaces.',
        previousCompanies: ['Local Startup', 'Web Agency'],
        salaryExpectation: 115000,
        availability: '3 weeks notice',
        notes: [
          { date: '2024-12-09', note: 'Application received - under review', author: 'System' }
        ]
      },
      {
        id: '5',
        fullName: 'Jessica Wong',
        email: 'jessica.wong@email.com',
        phone: '(555) 654-3210',
        location: 'Los Angeles, CA',
        jobId: '2',
        jobTitle: 'UX Designer',
        status: 'rejected',
        appliedDate: '2024-11-28',
        experience: '2 years',
        education: 'UCLA',
        skills: ['Sketch', 'InVision', 'Adobe Creative Suite'],
        matchScore: 65,
        resumeUrl: '#',
        portfolioUrl: 'https://jessicawong.design',
        bio: 'Junior UX designer with 2 years experience. Eager to learn and grow in a collaborative environment.',
        previousCompanies: ['Design Intern', 'Junior Designer'],
        salaryExpectation: 75000,
        availability: 'immediate',
        rejectionReason: 'Experience level did not meet requirements',
        rejectedDate: '2024-12-01',
        notes: [
          { date: '2024-11-29', note: 'Good potential but lacks senior experience', author: 'Design Team' },
          { date: '2024-12-01', note: 'Rejected - experience level mismatch', author: 'Sarah Johnson' }
        ]
      }
    ];
  }

  loadCandidates() {
    this.updateCandidatesDisplay();
  }

  updateCandidatesDisplay() {
    const container = document.getElementById('candidates-container');
    const noCandidatesMessage = document.getElementById('no-candidates-message');
    
    if (!container) return;

    if (this.filteredCandidates.length === 0) {
      container.style.display = 'none';
      if (noCandidatesMessage) {
        noCandidatesMessage.classList.remove('hidden');
      }
      return;
    }

    container.style.display = 'block';
    if (noCandidatesMessage) {
      noCandidatesMessage.classList.add('hidden');
    }

    container.innerHTML = this.filteredCandidates.map(candidate => this.generateCandidateHTML(candidate)).join('');
    
    // Update bulk actions bar
    this.updateBulkActionsBar();
  }

  generateCandidateHTML(candidate) {
    const statusBadgeClass = this.getStatusBadgeClass(candidate.status);
    const statusText = this.getStatusText(candidate.status);
    const daysAgo = this.getDaysAgo(candidate.appliedDate);
    const skillTags = candidate.skills.slice(0, 4).map(skill => 
      `<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">${skill}</span>`
    ).join('');
    
    const additionalSkills = candidate.skills.length > 4 ? 
      `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">+${candidate.skills.length - 4}</span>` : '';

    const statusInfo = this.getStatusInfo(candidate);

    return `
      <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-start space-x-4">
            <input type="checkbox" class="candidate-checkbox mt-2" data-candidate-id="${candidate.id}">
            <div class="w-12 h-12 bg-gradient-to-r ${this.getAvatarGradient(candidate.id)} rounded-full flex items-center justify-center text-white font-semibold">
              ${this.getInitials(candidate.fullName)}
            </div>
            <div class="flex-1">
              <div class="flex items-center mb-1">
                <h4 class="text-lg font-semibold text-gray-900">${candidate.fullName}</h4>
                <span class="ml-3 px-2 py-1 ${statusBadgeClass} text-xs font-medium rounded-full">${statusText}</span>
              </div>
              <p class="text-gray-600 text-sm mb-2">Applied for: ${candidate.jobTitle}</p>
              <div class="flex items-center text-sm text-gray-500 space-x-4">
                <span><i class="fas fa-map-marker-alt mr-1"></i>${candidate.location}</span>
                <span><i class="fas fa-envelope mr-1"></i>${candidate.email}</span>
                <span><i class="fas fa-phone mr-1"></i>${candidate.phone}</span>
              </div>
            </div>
          </div>
          <div class="text-right text-sm text-gray-500">
            Applied ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago
          </div>
        </div>
        
        <div class="mb-4">
          <div class="flex flex-wrap gap-2 mb-3">
            ${skillTags}
            ${additionalSkills}
          </div>
          <p class="text-sm text-gray-600">${candidate.bio}</p>
        </div>

        ${statusInfo}
        
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center text-sm">
              <i class="fas fa-star text-yellow-400 mr-1"></i>
              <span class="text-gray-600">Match Score: ${candidate.matchScore}%</span>
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-graduation-cap text-purple-400 mr-1"></i>
              <span class="text-gray-600">${candidate.education}</span>
            </div>
          </div>
          <div class="flex space-x-2">
            ${this.generateActionButtons(candidate)}
          </div>
        </div>
      </div>
    `;
  }

  getStatusInfo(candidate) {
    if (candidate.status === 'interview' && candidate.interviewDate) {
      return `
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div class="flex items-center text-sm text-yellow-800">
            <i class="fas fa-calendar-alt mr-2"></i>
            <strong>Interview scheduled for ${this.formatDate(candidate.interviewDate)} at ${candidate.interviewTime}</strong>
          </div>
          <div class="text-xs text-yellow-700 mt-1">${candidate.interviewType}</div>
        </div>
      `;
    }
    
    if (candidate.status === 'offer' && candidate.offerAmount) {
      const expiryDays = this.getDaysUntilDeadline(candidate.offerExpiry);
      return `
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-between text-sm text-green-800">
            <div class="flex items-center">
              <i class="fas fa-handshake mr-2"></i>
              <strong>Offer extended: $${candidate.offerAmount.toLocaleString()}/year + benefits</strong>
            </div>
            <div class="text-xs text-green-700">Expires in ${expiryDays} days</div>
          </div>
          <div class="text-xs text-green-700 mt-1">${candidate.offerStatus === 'pending' ? 'Candidate considering offer - follow up scheduled' : 'Offer status: ' + candidate.offerStatus}</div>
        </div>
      `;
    }
    
    return '';
  }

  generateActionButtons(candidate) {
    let buttons = [];

    // Resume/Portfolio button (always available)
    const resumeText = candidate.portfolioUrl !== '#' ? 'Portfolio' : 'Resume';
    buttons.push(`
      <button class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              data-action="view-resume" data-candidate-id="${candidate.id}">
        <i class="fas fa-file-alt mr-1"></i>${resumeText}
      </button>
    `);

    // Status-specific buttons
    switch (candidate.status) {
      case 'new':
      case 'reviewing':
        buttons.push(`
          <button class="px-3 py-1 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  data-action="reject-candidate" data-candidate-id="${candidate.id}">
            Reject
          </button>
          <button class="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  data-action="schedule-interview" data-candidate-id="${candidate.id}">
            Schedule Interview
          </button>
        `);
        break;
      
      case 'interview':
        buttons.push(`
          <button class="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  data-action="reschedule" data-candidate-id="${candidate.id}">
            Reschedule
          </button>
          <button class="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  data-action="send-offer" data-candidate-id="${candidate.id}">
            Send Offer
          </button>
        `);
        break;
      
      case 'offer':
        buttons.push(`
          <button class="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  data-action="follow-up" data-candidate-id="${candidate.id}">
            Follow Up
          </button>
        `);
        break;
      
      case 'hired':
        buttons.push(`
          <button class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg cursor-not-allowed" disabled>
            Hired
          </button>
        `);
        break;
      
      case 'rejected':
        // No action buttons for rejected candidates
        break;
    }

    // View details button (always available except for rejected)
    if (candidate.status !== 'rejected') {
      buttons.push(`
        <button class="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                data-action="view-details" data-candidate-id="${candidate.id}">
          View Details
        </button>
      `);
    }

    return buttons.join('');
  }

  getStatusBadgeClass(status) {
    const classes = {
      new: 'bg-blue-100 text-blue-800',
      reviewing: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      hired: 'bg-green-200 text-green-900',
      rejected: 'bg-red-100 text-red-800'
    };
    return classes[status] || classes.new;
  }

  getStatusText(status) {
    const texts = {
      new: 'New',
      reviewing: 'Reviewing',
      interview: 'Interview Scheduled',
      offer: 'Offer Extended',
      hired: 'Hired',
      rejected: 'Rejected'
    };
    return texts[status] || 'New';
  }

  getAvatarGradient(id) {
    const gradients = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-indigo-400',
      'from-green-400 to-teal-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
      'from-indigo-400 to-purple-400'
    ];
    return gradients[parseInt(id) % gradients.length];
  }

  getInitials(fullName) {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
  }

  getDaysAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getDaysUntilDeadline(dateString) {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  filterCandidates(searchTerm, jobFilter, statusFilter) {
    this.currentFilters.search = searchTerm;
    this.currentFilters.job = jobFilter;
    this.currentFilters.status = statusFilter;
    
    this.filteredCandidates = this.candidates.filter(candidate => {
      const matchesSearch = !searchTerm || 
        candidate.fullName.toLowerCase().includes(searchTerm) ||
        candidate.email.toLowerCase().includes(searchTerm) ||
        candidate.location.toLowerCase().includes(searchTerm) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm));
      
      const matchesJob = jobFilter === 'all' || candidate.jobId === jobFilter;
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      
      return matchesSearch && matchesJob && matchesStatus;
    });
    
    this.updateCandidatesDisplay();
  }

  // Candidate Actions
  viewResume(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // In a real application, this would open the resume/portfolio
    if (candidate.portfolioUrl && candidate.portfolioUrl !== '#') {
      window.open(candidate.portfolioUrl, '_blank');
    } else {
      window.recruiterToastManager?.show('Resume viewing functionality would be implemented here', 'info');
    }
  }

  async scheduleInterview(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // In a real application, this would show a scheduling modal
    const confirmed = confirm(`Schedule interview with ${candidate.fullName}?`);
    if (confirmed) {
      // Update candidate status
      candidate.status = 'interview';
      candidate.interviewDate = '2024-12-20';
      candidate.interviewTime = '2:00 PM PST';
      candidate.interviewType = 'Technical interview with the engineering team';
      
      // Add note
      candidate.notes = candidate.notes || [];
      candidate.notes.push({
        date: new Date().toISOString().split('T')[0],
        note: 'Interview scheduled',
        author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
      });

      this.saveCandidatesToStorage();
      this.updateCandidatesDisplay();
      window.recruiterToastManager?.show('Interview scheduled successfully', 'success');
    }
  }

  async rejectCandidate(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const reason = prompt(`Reason for rejecting ${candidate.fullName}:`);
    if (reason) {
      candidate.status = 'rejected';
      candidate.rejectionReason = reason;
      candidate.rejectedDate = new Date().toISOString().split('T')[0];
      
      // Add note
      candidate.notes = candidate.notes || [];
      candidate.notes.push({
        date: new Date().toISOString().split('T')[0],
        note: `Rejected: ${reason}`,
        author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
      });

      this.saveCandidatesToStorage();
      this.updateCandidatesDisplay();
      window.recruiterToastManager?.show('Candidate rejected', 'success');
    }
  }

  async sendOffer(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const amount = prompt(`Offer amount for ${candidate.fullName} (annual salary):`, candidate.salaryExpectation || '100000');
    if (amount && !isNaN(amount)) {
      candidate.status = 'offer';
      candidate.offerAmount = parseInt(amount);
      candidate.offerExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 days from now
      candidate.offerStatus = 'pending';
      
      // Add note
      candidate.notes = candidate.notes || [];
      candidate.notes.push({
        date: new Date().toISOString().split('T')[0],
        note: `Offer extended: $${parseInt(amount).toLocaleString()}`,
        author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
      });

      this.saveCandidatesToStorage();
      this.updateCandidatesDisplay();
      window.recruiterToastManager?.show('Offer sent successfully', 'success');
    }
  }

  followUp(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const note = prompt(`Follow-up note for ${candidate.fullName}:`);
    if (note) {
      candidate.notes = candidate.notes || [];
      candidate.notes.push({
        date: new Date().toISOString().split('T')[0],
        note: `Follow-up: ${note}`,
        author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
      });

      this.saveCandidatesToStorage();
      window.recruiterToastManager?.show('Follow-up note added', 'success');
    }
  }

  viewCandidateDetails(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // In a real application, this would show a detailed modal
    window.recruiterToastManager?.show('Candidate details modal would be shown here', 'info');
  }

  rescheduleInterview(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const newDate = prompt(`Reschedule interview for ${candidate.fullName}. New date:`, candidate.interviewDate);
    if (newDate) {
      candidate.interviewDate = newDate;
      
      candidate.notes = candidate.notes || [];
      candidate.notes.push({
        date: new Date().toISOString().split('T')[0],
        note: `Interview rescheduled to ${newDate}`,
        author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
      });

      this.saveCandidatesToStorage();
      this.updateCandidatesDisplay();
      window.recruiterToastManager?.show('Interview rescheduled', 'success');
    }
  }

  // Bulk actions
  handleCandidateSelection(checkbox) {
    const candidateId = checkbox.dataset.candidateId;
    if (checkbox.checked) {
      this.selectedCandidates.add(candidateId);
    } else {
      this.selectedCandidates.delete(candidateId);
    }
    this.updateBulkActionsBar();
  }

  toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.candidate-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
      const candidateId = checkbox.dataset.candidateId;
      if (checked) {
        this.selectedCandidates.add(candidateId);
      } else {
        this.selectedCandidates.delete(candidateId);
      }
    });
    this.updateBulkActionsBar();
  }

  updateBulkActionsBar() {
    const bulkActionsBar = document.getElementById('bulk-actions-bar');
    const selectedCount = document.getElementById('selected-count');
    
    if (this.selectedCandidates.size > 0) {
      if (bulkActionsBar) {
        bulkActionsBar.classList.remove('hidden');
        if (selectedCount) {
          selectedCount.textContent = this.selectedCandidates.size;
        }
      }
    } else {
      if (bulkActionsBar) {
        bulkActionsBar.classList.add('hidden');
      }
    }
  }

  handleBulkAction(action) {
    if (this.selectedCandidates.size === 0) return;

    const selectedArray = Array.from(this.selectedCandidates);
    
    switch (action) {
      case 'move-to-reviewing':
        this.bulkUpdateStatus(selectedArray, 'reviewing');
        break;
      case 'reject-selected':
        this.bulkReject(selectedArray);
        break;
      case 'schedule-interviews':
        this.bulkScheduleInterviews(selectedArray);
        break;
    }
  }

  bulkUpdateStatus(candidateIds, newStatus) {
    candidateIds.forEach(id => {
      const candidate = this.candidates.find(c => c.id === id);
      if (candidate && candidate.status !== 'rejected' && candidate.status !== 'hired') {
        candidate.status = newStatus;
        candidate.notes = candidate.notes || [];
        candidate.notes.push({
          date: new Date().toISOString().split('T')[0],
          note: `Status changed to ${newStatus} (bulk action)`,
          author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
        });
      }
    });

    this.saveCandidatesToStorage();
    this.updateCandidatesDisplay();
    this.clearSelection();
    window.recruiterToastManager?.show(`${candidateIds.length} candidates updated`, 'success');
  }

  bulkReject(candidateIds) {
    const reason = prompt('Reason for rejecting selected candidates:');
    if (!reason) return;

    candidateIds.forEach(id => {
      const candidate = this.candidates.find(c => c.id === id);
      if (candidate && candidate.status !== 'rejected' && candidate.status !== 'hired') {
        candidate.status = 'rejected';
        candidate.rejectionReason = reason;
        candidate.rejectedDate = new Date().toISOString().split('T')[0];
        
        candidate.notes = candidate.notes || [];
        candidate.notes.push({
          date: new Date().toISOString().split('T')[0],
          note: `Rejected (bulk action): ${reason}`,
          author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
        });
      }
    });

    this.saveCandidatesToStorage();
    this.updateCandidatesDisplay();
    this.clearSelection();
    window.recruiterToastManager?.show(`${candidateIds.length} candidates rejected`, 'success');
  }

  bulkScheduleInterviews(candidateIds) {
    const date = prompt('Interview date for selected candidates (YYYY-MM-DD):');
    if (!date) return;

    candidateIds.forEach(id => {
      const candidate = this.candidates.find(c => c.id === id);
      if (candidate && (candidate.status === 'new' || candidate.status === 'reviewing')) {
        candidate.status = 'interview';
        candidate.interviewDate = date;
        candidate.interviewTime = 'TBD';
        candidate.interviewType = 'Bulk scheduled interview';
        
        candidate.notes = candidate.notes || [];
        candidate.notes.push({
          date: new Date().toISOString().split('T')[0],
          note: `Interview scheduled for ${date} (bulk action)`,
          author: window.recruiterAuth?.currentUser?.fullName || 'Recruiter'
        });
      }
    });

    this.saveCandidatesToStorage();
    this.updateCandidatesDisplay();
    this.clearSelection();
    window.recruiterToastManager?.show(`Interviews scheduled for ${candidateIds.length} candidates`, 'success');
  }

  clearSelection() {
    this.selectedCandidates.clear();
    document.querySelectorAll('.candidate-checkbox').forEach(cb => cb.checked = false);
    this.updateBulkActionsBar();
  }

  // Public API
  getCandidates() {
    return this.candidates;
  }

  getCandidate(candidateId) {
    return this.candidates.find(c => c.id === candidateId);
  }

  getCandidatesByJob(jobId) {
    return this.candidates.filter(c => c.jobId === jobId);
  }

  getCandidateStats() {
    return {
      total: this.candidates.length,
      new: this.candidates.filter(c => c.status === 'new').length,
      reviewing: this.candidates.filter(c => c.status === 'reviewing').length,
      interview: this.candidates.filter(c => c.status === 'interview').length,
      offer: this.candidates.filter(c => c.status === 'offer').length,
      hired: this.candidates.filter(c => c.status === 'hired').length,
      rejected: this.candidates.filter(c => c.status === 'rejected').length
    };
  }
}

// Initialize and expose globally
window.recruiterCandidateManager = new RecruiterCandidateManager();