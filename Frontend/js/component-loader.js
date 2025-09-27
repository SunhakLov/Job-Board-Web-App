// Component Loader Utility
class ComponentLoader {
  constructor() {
    this.componentsPath = '../components/';
    this.loadedComponents = new Set();
    this.componentCache = new Map();
    this.loadingComponents = new Set();
  }

  async loadComponent(name, targetId, type = 'student') {
    const filePath = `${this.componentsPath}${type}/${name}.html`;
    const container = document.getElementById(targetId);
    
    if (!container) {
      console.error(`Container ${targetId} not found`);
      return;
    }

    // Prevent duplicate loading
    const componentKey = `${type}/${name}`;
    if (this.loadingComponents.has(componentKey)) {
      return;
    }

    this.loadingComponents.add(componentKey);

    try {
      let html;
      
      // Check cache first
      if (this.componentCache.has(componentKey)) {
        html = this.componentCache.get(componentKey);
      } else {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load component: ${response.status}`);
        }
        
        html = await response.text();
        this.componentCache.set(componentKey, html);
      }
      
      container.innerHTML = html;
      this.loadedComponents.add(componentKey);
      
      // Remove loading class if present
      container.classList.remove('loading-component');
      
      // Emit component loaded event
      container.dispatchEvent(new CustomEvent('componentLoaded', {
        detail: { name, type, targetId }
      }));
      
      console.log(`Component ${type}/${name} loaded successfully`);
    } catch (error) {
      console.error(`Error loading component ${type}/${name}:`, error);
      // Show error state
      container.innerHTML = `
        <div class="p-4 text-center text-red-500">
          <i class="fas fa-exclamation-triangle mb-2"></i>
          <div class="text-sm">Failed to load ${name}</div>
          <button onclick="window.location.reload()" class="mt-2 text-xs text-red-600 underline hover:text-red-700">
            Reload Page
          </button>
        </div>
      `;
    } finally {
      this.loadingComponents.delete(componentKey);
    }
  }

  async loadMultipleComponents(components, type = 'student') {
    const promises = components.map(({ name, targetId }) => 
      this.loadComponent(name, targetId, type)
    );
    
    await Promise.all(promises);
  }

  // New method to handle data-component attributes
  async loadComponentsFromDOM() {
    const componentElements = document.querySelectorAll('[data-component]');
    const loadPromises = Array.from(componentElements).map(element => 
      this.loadComponentFromElement(element)
    );
    
    await Promise.all(loadPromises);
  }

  async loadComponentFromElement(element) {
    const componentPath = element.dataset.component;
    if (!componentPath) return;

    const [type, name] = componentPath.split('/');
    if (!type || !name) {
      console.error(`Invalid component path: ${componentPath}`);
      return;
    }

    const componentKey = componentPath;
    if (this.loadingComponents.has(componentKey)) {
      return;
    }

    this.loadingComponents.add(componentKey);

    try {
      let html;
      
      if (this.componentCache.has(componentKey)) {
        html = this.componentCache.get(componentKey);
      } else {
        const filePath = `${this.componentsPath}${componentPath}.html`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
          throw new Error(`Failed to load component: ${componentPath} (${response.status})`);
        }
        
        html = await response.text();
        this.componentCache.set(componentKey, html);
      }

      element.innerHTML = html;
      element.classList.remove('loading-component');
      this.loadedComponents.add(componentKey);

      // Emit event
      element.dispatchEvent(new CustomEvent('componentLoaded', {
        detail: { componentPath, element }
      }));

    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      element.innerHTML = `
        <div class="p-4 text-center text-red-500">
          <i class="fas fa-exclamation-triangle mb-2"></i>
          <div class="text-sm">Failed to load component: ${componentPath}</div>
          <button onclick="window.location.reload()" class="mt-2 text-xs text-red-600 underline hover:text-red-700">
            Reload Page
          </button>
        </div>
      `;
    } finally {
      this.loadingComponents.delete(componentKey);
    }
  }

  isLoaded(componentName) {
    return this.loadedComponents.has(componentName);
  }

  clearCache() {
    this.componentCache.clear();
  }
}

// Auto-load components based on data attributes
document.addEventListener('DOMContentLoaded', async () => {
  const loader = new ComponentLoader();
  
  // Method 1: Load components based on body data attribute (legacy support)
  const body = document.body;
  const componentType = body.getAttribute('data-component-loader');
  
  if (componentType) {
    // Define components to load based on type
    const componentsToLoad = {
      student: [
        { name: 'auth-modal', targetId: 'auth-modal-container' },
        { name: 'header', targetId: 'header-container' },
        { name: 'welcome-section', targetId: 'welcome-section-container' },
        { name: 'dashboard-stats', targetId: 'dashboard-stats-container' },
        { name: 'navigation-tabs', targetId: 'navigation-tabs-container' },
        { name: 'job-search', targetId: 'search-tab-container' },
        { name: 'applications-tab', targetId: 'applications-tab-container' },
        { name: 'saved-jobs-tab', targetId: 'saved-jobs-tab-container' },
        { name: 'profile-tab', targetId: 'profile-tab-container' }
      ],
      recruiter: [
        { name: 'auth-modal', targetId: 'recruiter-auth-modal-container' },
        { name: 'header', targetId: 'recruiter-header-container' },
        { name: 'welcome-section', targetId: 'recruiter-welcome-section-container' },
        { name: 'dashboard-stats', targetId: 'recruiter-dashboard-stats-container' },
        { name: 'navigation-tabs', targetId: 'recruiter-navigation-tabs-container' }
      ]
    };

    const components = componentsToLoad[componentType] || [];
    await loader.loadMultipleComponents(components, componentType);
  }
  
  // Method 2: Load components with data-component attributes (new method)
  await loader.loadComponentsFromDOM();
  
  // Make loader globally available
  window.componentLoader = loader;
});

// Export for module use
window.ComponentLoader = ComponentLoader;