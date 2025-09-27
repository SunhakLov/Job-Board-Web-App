// Recruiter Toast Manager (Notification System)
class RecruiterToastManager {
  constructor() {
    this.toasts = [];
    this.maxToasts = 5;
    this.defaultDuration = 5000;
    this.init();
  }

  init() {
    this.createToastContainer();
  }

  createToastContainer() {
    if (document.getElementById('recruiter-toast-container')) return;

    const container = document.createElement('div');
    container.id = 'recruiter-toast-container';
    container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(container);
  }

  show(message, type = 'info', duration = this.defaultDuration) {
    const toast = this.createToast(message, type, duration);
    this.addToast(toast);
    this.scheduleRemoval(toast.id, duration);
    return toast.id;
  }

  createToast(message, type, duration) {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration,
      element: this.createToastElement(id, message, type)
    };

    return toast;
  }

  createToastElement(id, message, type) {
    const toast = document.createElement('div');
    toast.id = `recruiter-toast-${id}`;
    toast.className = `transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;
    
    const { bgColor, textColor, icon } = this.getTypeStyles(type);
    
    toast.innerHTML = `
      <div class="flex items-center p-4 ${bgColor} ${textColor} rounded-lg shadow-lg min-w-80 max-w-96">
        <div class="flex-shrink-0 mr-3">
          <i class="fas ${icon}"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button onclick="window.recruiterToastManager.dismiss('${id}')" 
                class="flex-shrink-0 ml-3 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors duration-200">
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    `;

    return toast;
  }

  getTypeStyles(type) {
    const styles = {
      success: {
        bgColor: 'bg-green-100 border border-green-200',
        textColor: 'text-green-800',
        icon: 'fa-check-circle'
      },
      error: {
        bgColor: 'bg-red-100 border border-red-200',
        textColor: 'text-red-800',
        icon: 'fa-exclamation-circle'
      },
      warning: {
        bgColor: 'bg-yellow-100 border border-yellow-200',
        textColor: 'text-yellow-800',
        icon: 'fa-exclamation-triangle'
      },
      info: {
        bgColor: 'bg-blue-100 border border-blue-200',
        textColor: 'text-blue-800',
        icon: 'fa-info-circle'
      }
    };

    return styles[type] || styles.info;
  }

  addToast(toast) {
    // Remove oldest toast if we've reached the maximum
    if (this.toasts.length >= this.maxToasts) {
      const oldestToast = this.toasts.shift();
      this.removeToast(oldestToast.id);
    }

    this.toasts.push(toast);
    
    const container = document.getElementById('recruiter-toast-container');
    if (container) {
      container.appendChild(toast.element);
      
      // Trigger animation
      setTimeout(() => {
        toast.element.classList.remove('translate-x-full', 'opacity-0');
        toast.element.classList.add('translate-x-0', 'opacity-100');
      }, 10);
    }
  }

  scheduleRemoval(toastId, duration) {
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toastId);
      }, duration);
    }
  }

  dismiss(toastId) {
    const toast = this.toasts.find(t => t.id == toastId);
    if (!toast) return;

    // Animate out
    toast.element.classList.remove('translate-x-0', 'opacity-100');
    toast.element.classList.add('translate-x-full', 'opacity-0');

    // Remove from DOM after animation
    setTimeout(() => {
      this.removeToast(toastId);
    }, 300);
  }

  removeToast(toastId) {
    const toastIndex = this.toasts.findIndex(t => t.id == toastId);
    if (toastIndex === -1) return;

    const toast = this.toasts[toastIndex];
    
    // Remove from array
    this.toasts.splice(toastIndex, 1);
    
    // Remove from DOM
    if (toast.element && toast.element.parentNode) {
      toast.element.parentNode.removeChild(toast.element);
    }
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  // Clear all toasts
  clear() {
    this.toasts.forEach(toast => {
      this.dismiss(toast.id);
    });
  }

  // Show loading toast (doesn't auto-dismiss)
  loading(message) {
    const id = this.show(`<i class="fas fa-spinner fa-spin mr-2"></i>${message}`, 'info', 0);
    return {
      dismiss: () => this.dismiss(id),
      update: (newMessage, type = 'info') => {
        const toast = this.toasts.find(t => t.id == id);
        if (toast) {
          const messageEl = toast.element.querySelector('p');
          if (messageEl) {
            messageEl.innerHTML = newMessage;
          }
          
          // Update styles if type changed
          if (type !== 'info') {
            const { bgColor, textColor, icon } = this.getTypeStyles(type);
            const containerEl = toast.element.querySelector('div');
            if (containerEl) {
              containerEl.className = `flex items-center p-4 ${bgColor} ${textColor} rounded-lg shadow-lg min-w-80 max-w-96`;
            }
            const iconEl = toast.element.querySelector('i');
            if (iconEl) {
              iconEl.className = `fas ${icon}`;
            }
          }
        }
      }
    };
  }

  // Show confirmation toast with action buttons
  confirm(message, onConfirm, onCancel) {
    const id = Date.now() + Math.random();
    const toast = document.createElement('div');
    toast.id = `recruiter-toast-${id}`;
    toast.className = `transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;
    
    toast.innerHTML = `
      <div class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg min-w-80 max-w-96">
        <div class="flex-shrink-0 mr-3">
          <i class="fas fa-question-circle text-purple-600"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">${message}</p>
          <div class="mt-3 flex space-x-2">
            <button onclick="window.recruiterToastManager.handleConfirm('${id}', true)" 
                    class="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200">
              Confirm
            </button>
            <button onclick="window.recruiterToastManager.handleConfirm('${id}', false)" 
                    class="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200">
              Cancel
            </button>
          </div>
        </div>
        <button onclick="window.recruiterToastManager.dismiss('${id}')" 
                class="flex-shrink-0 ml-3 p-1 hover:bg-gray-100 rounded transition-colors duration-200">
          <i class="fas fa-times text-xs text-gray-500"></i>
        </button>
      </div>
    `;

    // Store callbacks
    this.confirmCallbacks = this.confirmCallbacks || {};
    this.confirmCallbacks[id] = { onConfirm, onCancel };

    // Add to toasts array
    this.toasts.push({ id, element: toast, type: 'confirm' });

    const container = document.getElementById('recruiter-toast-container');
    if (container) {
      container.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
      }, 10);
    }

    return id;
  }

  handleConfirm(id, confirmed) {
    const callbacks = this.confirmCallbacks?.[id];
    if (callbacks) {
      if (confirmed && callbacks.onConfirm) {
        callbacks.onConfirm();
      } else if (!confirmed && callbacks.onCancel) {
        callbacks.onCancel();
      }
      
      delete this.confirmCallbacks[id];
    }
    
    this.dismiss(id);
  }

  // Show progress toast
  progress(message, progress = 0) {
    const id = Date.now() + Math.random();
    const toast = document.createElement('div');
    toast.id = `recruiter-toast-${id}`;
    toast.className = `transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;
    
    toast.innerHTML = `
      <div class="flex items-center p-4 bg-blue-100 border border-blue-200 text-blue-800 rounded-lg shadow-lg min-w-80 max-w-96">
        <div class="flex-shrink-0 mr-3">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium mb-2">${message}</p>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
          <p class="text-xs mt-1">${Math.round(progress)}% complete</p>
        </div>
        <button onclick="window.recruiterToastManager.dismiss('${id}')" 
                class="flex-shrink-0 ml-3 p-1 hover:bg-blue-200 rounded transition-colors duration-200">
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    `;

    // Add to toasts array
    this.toasts.push({ id, element: toast, type: 'progress' });

    const container = document.getElementById('recruiter-toast-container');
    if (container) {
      container.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
      }, 10);
    }

    return {
      update: (newProgress, newMessage) => {
        const progressBar = toast.querySelector('.bg-blue-600');
        const progressText = toast.querySelector('.text-xs');
        const messageEl = toast.querySelector('p');
        
        if (progressBar) {
          progressBar.style.width = `${newProgress}%`;
        }
        if (progressText) {
          progressText.textContent = `${Math.round(newProgress)}% complete`;
        }
        if (newMessage && messageEl) {
          messageEl.textContent = newMessage;
        }
      },
      complete: (message = 'Complete!') => {
        this.dismiss(id);
        this.success(message);
      },
      dismiss: () => this.dismiss(id)
    };
  }
}

// Initialize and expose globally
window.recruiterToastManager = new RecruiterToastManager();