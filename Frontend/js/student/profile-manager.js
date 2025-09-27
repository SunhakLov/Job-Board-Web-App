// Profile Manager Module
class ProfileManager {
  constructor() {
    this.userProfile = {
      firstName: 'John',
      lastName: 'Student',
      email: 'john.student@university.edu',
      phone: '+1 (555) 123-4567',
      university: 'Stanford University',
      graduationYear: '2025',
      major: 'Computer Science',
      gpa: '3.8',
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git']
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateProfile(e);
      });
    }

    // Skills management
    const newSkillInput = document.getElementById('newSkill');
    if (newSkillInput) {
      newSkillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addSkill();
        }
      });
    }
  }

  updateProfile(e) {
    const formData = new FormData(e.target);
    
    // Update profile data
    Object.keys(this.userProfile).forEach(key => {
      if (formData.has(key)) {
        this.userProfile[key] = formData.get(key);
      }
    });

    // Simulate API call
    setTimeout(() => {
      window.toastManager?.show('Profile updated successfully!', 'success');
      this.renderProfile();
    }, 1000);
  }

  addSkill() {
    const skillInput = document.getElementById('newSkill');
    if (!skillInput) return;

    const skill = skillInput.value.trim();
    if (!skill) return;

    if (this.userProfile.skills.includes(skill)) {
      window.toastManager?.show('Skill already exists!', 'warning');
      return;
    }

    this.userProfile.skills.push(skill);
    skillInput.value = '';
    this.renderSkills();
    window.toastManager?.show(`Added "${skill}" to your skills!`, 'success');
  }

  removeSkill(skill) {
    const index = this.userProfile.skills.indexOf(skill);
    if (index > -1) {
      this.userProfile.skills.splice(index, 1);
      this.renderSkills();
      window.toastManager?.show(`Removed "${skill}" from your skills!`, 'info');
    }
  }

  renderSkills() {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;

    skillsList.innerHTML = this.userProfile.skills.map(skill => `
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
        ${skill}
        <button onclick="profileManager.removeSkill('${skill}')" class="ml-2 text-blue-600 hover:text-blue-800">
          <i class="fas fa-times text-xs"></i>
        </button>
      </span>
    `).join('');
  }

  renderProfile() {
    // Update profile display elements
    const profileElements = {
      firstName: document.querySelector('input[value="John"]'),
      lastName: document.querySelector('input[value="Student"]'),
      email: document.querySelector('input[value*="university.edu"]'),
      phone: document.querySelector('input[value*="555"]'),
      university: document.querySelector('input[value*="Stanford"]'),
      major: document.querySelector('input[value*="Computer Science"]'),
      gpa: document.querySelector('input[value="3.8"]')
    };

    Object.keys(profileElements).forEach(key => {
      const element = profileElements[key];
      if (element && this.userProfile[key]) {
        element.value = this.userProfile[key];
      }
    });

    this.renderSkills();
  }

  uploadResume() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate file upload
        window.toastManager?.show(`Uploading ${file.name}...`, 'info');
        setTimeout(() => {
          window.toastManager?.show('Resume uploaded successfully!', 'success');
        }, 2000);
      }
    };
    fileInput.click();
  }

  updatePhoto() {
    // Create file input for photo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate photo upload
        window.toastManager?.show(`Uploading ${file.name}...`, 'info');
        setTimeout(() => {
          window.toastManager?.show('Profile photo updated successfully!', 'success');
        }, 2000);
      }
    };
    fileInput.click();
  }

  downloadProfile() {
    // Simulate profile download
    window.toastManager?.show('Generating profile PDF...', 'info');
    setTimeout(() => {
      window.toastManager?.show('Profile downloaded successfully!', 'success');
    }, 1500);
  }
}

// Export for global use
window.ProfileManager = ProfileManager;