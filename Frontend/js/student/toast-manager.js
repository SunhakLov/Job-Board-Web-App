// Toast Notification System
class ToastManager {
  constructor() {
    this.toasts = [];
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    const toast = this.createToast(message, type);
    const container = document.getElementById('toast-container');
    
    container.appendChild(toast);
    this.toasts.push(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    return toast;
  }

  remove(toast) {
    if (!toast.parentNode) return;

    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
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

    toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform translate-x-full opacity-0 transition-all duration-300 max-w-sm`;
    toast.innerHTML = `
      <i class="${icons[type]}"></i>
      <span class="flex-1">${message}</span>
      <button onclick="window.toastManager.remove(this.parentElement)" class="ml-2 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    return toast;
  }

  clear() {
    this.toasts.forEach(toast => this.remove(toast));
  }
}

// Export for global use
window.ToastManager = ToastManager;