// Recruiter Notification Manager
class RecruiterNotificationManager {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.isDropdownOpen = false;
    this.init();
  }

  init() {
    this.loadNotificationsFromStorage();
    this.bindEvents();
    this.generateSampleNotifications();
    this.updateUI();
  }

  bindEvents() {
    // Bell icon click
    document.addEventListener('click', (e) => {
      if (e.target.closest('#notification-bell')) {
        e.preventDefault();
        this.toggleNotificationDropdown();
      }
      
      // Close dropdown when clicking outside
      if (!e.target.closest('#notification-dropdown') && !e.target.closest('#notification-bell')) {
        this.closeNotificationDropdown();
      }
      
      // Mark all as read
      if (e.target.matches('#mark-all-read')) {
        e.preventDefault();
        this.markAllAsRead();
      }
      
      // Mark individual notification as read
      if (e.target.closest('.notification-item')) {
        const notificationId = e.target.closest('.notification-item').dataset.notificationId;
        this.markAsRead(notificationId);
      }
    });

    // Listen for new job applications (simulate real-time notifications)
    this.startNotificationSimulation();
  }

  generateSampleNotifications() {
    if (this.notifications.length === 0) {
      const sampleNotifications = [
        {
          id: Date.now() + 1,
          type: 'new_application',
          title: 'New Application Received',
          message: 'Sarah Johnson applied for Senior Frontend Developer position',
          timestamp: new Date(),
          isRead: false,
          jobId: '1',
          applicantId: 'app_001'
        },
        {
          id: Date.now() + 2,
          type: 'interview_scheduled',
          title: 'Interview Scheduled',
          message: 'Interview scheduled with Mike Davis for UX Designer position',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: false,
          jobId: '2',
          applicantId: 'app_002'
        },
        {
          id: Date.now() + 3,
          type: 'application_withdrawn',
          title: 'Application Withdrawn',
          message: 'Alex Thompson withdrew application for Data Science Intern',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: true,
          jobId: '3',
          applicantId: 'app_003'
        }
      ];
      
      this.notifications = sampleNotifications;
      this.saveNotificationsToStorage();
    }
  }

  startNotificationSimulation() {
    // Simulate new notifications every few minutes (in a real app, this would be real-time)
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        this.addNewNotification();
      }
    }, 60000); // Check every minute
  }

  addNewNotification() {
    const notificationTypes = [
      {
        type: 'new_application',
        title: 'New Application Received',
        getMessage: () => {
          const names = ['John Smith', 'Emily Chen', 'David Rodriguez', 'Lisa Wang', 'Michael Brown'];
          const jobs = ['Senior Frontend Developer', 'UX Designer', 'Backend Engineer', 'Product Manager'];
          const name = names[Math.floor(Math.random() * names.length)];
          const job = jobs[Math.floor(Math.random() * jobs.length)];
          return `${name} applied for ${job} position`;
        }
      },
      {
        type: 'interview_reminder',
        title: 'Interview Reminder',
        getMessage: () => {
          const names = ['Sarah Davis', 'Tom Wilson', 'Anna Lee', 'Chris Johnson'];
          const name = names[Math.floor(Math.random() * names.length)];
          return `Upcoming interview with ${name} in 1 hour`;
        }
      },
      {
        type: 'job_expired',
        title: 'Job Posting Expired',
        getMessage: () => {
          const jobs = ['Marketing Coordinator', 'Software Engineer', 'Sales Representative'];
          const job = jobs[Math.floor(Math.random() * jobs.length)];
          return `${job} posting has expired`;
        }
      }
    ];

    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const notification = {
      id: Date.now(),
      type: randomType.type,
      title: randomType.title,
      message: randomType.getMessage(),
      timestamp: new Date(),
      isRead: false,
      jobId: Math.floor(Math.random() * 5) + 1,
      applicantId: `app_${Date.now()}`
    };

    this.notifications.unshift(notification);
    this.saveNotificationsToStorage();
    this.updateUI();

    // Show toast notification
    window.recruiterToastManager?.show(notification.message, 'info');
  }

  toggleNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;

    if (this.isDropdownOpen) {
      this.closeNotificationDropdown();
    } else {
      this.openNotificationDropdown();
    }
  }

  openNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;

    dropdown.classList.remove('hidden');
    this.isDropdownOpen = true;
    this.renderNotifications();
  }

  closeNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;

    dropdown.classList.add('hidden');
    this.isDropdownOpen = false;
  }

  renderNotifications() {
    const listContainer = document.getElementById('notification-list');
    if (!listContainer) return;

    if (this.notifications.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center text-gray-500">
          <i class="fas fa-bell-slash text-3xl mb-2"></i>
          <p>No notifications yet</p>
        </div>
      `;
      return;
    }

    const notificationsHTML = this.notifications
      .slice(0, 10) // Show only latest 10 notifications
      .map(notification => this.generateNotificationHTML(notification))
      .join('');

    listContainer.innerHTML = notificationsHTML;
  }

  generateNotificationHTML(notification) {
    const timeAgo = this.getTimeAgo(notification.timestamp);
    const iconClass = this.getNotificationIcon(notification.type);
    const bgClass = notification.isRead ? 'bg-gray-50' : 'bg-blue-50';

    return `
      <div class="notification-item ${bgClass} p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors duration-200" 
           data-notification-id="${notification.id}">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <i class="${iconClass} text-purple-600 text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-sm font-medium text-gray-900 truncate">${notification.title}</h4>
              ${!notification.isRead ? '<div class="w-2 h-2 bg-purple-600 rounded-full"></div>' : ''}
            </div>
            <p class="text-sm text-gray-600 mb-1">${notification.message}</p>
            <p class="text-xs text-gray-500">${timeAgo}</p>
          </div>
        </div>
      </div>
    `;
  }

  getNotificationIcon(type) {
    const iconMap = {
      'new_application': 'fas fa-user-plus',
      'interview_scheduled': 'fas fa-calendar-check',
      'interview_reminder': 'fas fa-clock',
      'application_withdrawn': 'fas fa-user-minus',
      'job_expired': 'fas fa-exclamation-triangle',
      'message': 'fas fa-comment',
      'system': 'fas fa-cog'
    };
    return iconMap[type] || 'fas fa-info-circle';
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id == notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.saveNotificationsToStorage();
      this.updateUI();
      this.renderNotifications(); // Re-render to update visual state
    }
  }

  markAllAsRead() {
    let hasUnread = false;
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        hasUnread = true;
      }
    });

    if (hasUnread) {
      this.saveNotificationsToStorage();
      this.updateUI();
      this.renderNotifications();
      window.recruiterToastManager?.show('All notifications marked as read', 'success');
    }
  }

  updateUI() {
    this.calculateUnreadCount();
    this.updateBadge();
  }

  calculateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  updateBadge() {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;

    if (this.unreadCount > 0) {
      badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  loadNotificationsFromStorage() {
    const saved = localStorage.getItem('recruiter_notifications');
    if (saved) {
      try {
        this.notifications = JSON.parse(saved).map(notification => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }));
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.notifications = [];
      }
    }
  }

  saveNotificationsToStorage() {
    try {
      localStorage.setItem('recruiter_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Public API methods
  addNotification(type, title, message, metadata = {}) {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      ...metadata
    };

    this.notifications.unshift(notification);
    this.saveNotificationsToStorage();
    this.updateUI();

    // Show toast
    window.recruiterToastManager?.show(message, 'info');
  }

  getUnreadCount() {
    return this.unreadCount;
  }

  getNotifications() {
    return this.notifications;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.saveNotificationsToStorage();
    this.updateUI();
    this.renderNotifications();
  }
}

// Initialize and expose globally
window.recruiterNotificationManager = new RecruiterNotificationManager();