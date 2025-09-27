// Enhanced Component Loader with Error Handling and Caching
class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.retryCount = new Map();
    this.maxRetries = 3;
  }

  async loadComponent(componentPath, targetSelector, options = {}) {
    try {
      // Check if already loading
      if (this.loadingPromises.has(componentPath)) {
        return await this.loadingPromises.get(componentPath);
      }

      // Check cache first
      if (this.cache.has(componentPath) && !options.forceReload) {
        return this.insertComponent(this.cache.get(componentPath), targetSelector);
      }

      // Create loading promise
      const loadingPromise = this.fetchComponent(componentPath);
      this.loadingPromises.set(componentPath, loadingPromise);

      const html = await loadingPromise;
      
      // Cache the result
      this.cache.set(componentPath, html);
      this.loadingPromises.delete(componentPath);
      this.retryCount.delete(componentPath);

      return this.insertComponent(html, targetSelector);
      
    } catch (error) {
      this.loadingPromises.delete(componentPath);
      
      // Retry logic
      const currentRetries = this.retryCount.get(componentPath) || 0;
      if (currentRetries < this.maxRetries) {
        this.retryCount.set(componentPath, currentRetries + 1);
        console.warn(`Retrying component load: ${componentPath} (${currentRetries + 1}/${this.maxRetries})`);
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentRetries) * 1000));
        return this.loadComponent(componentPath, targetSelector, options);
      }
      
      console.error(`Failed to load component after ${this.maxRetries} retries:`, componentPath, error);
      this.handleLoadError(targetSelector, componentPath);
      throw error;
    }
  }

  async fetchComponent(componentPath) {
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  }

  insertComponent(html, targetSelector) {
    const targetElement = document.querySelector(targetSelector);
    
    if (!targetElement) {
      throw new Error(`Target element not found: ${targetSelector}`);
    }
    
    targetElement.innerHTML = html;
    
    // Dispatch custom event for component loaded
    targetElement.dispatchEvent(new CustomEvent('componentLoaded', {
      bubbles: true,
      detail: { selector: targetSelector, html }
    }));
    
    return targetElement;
  }

  handleLoadError(targetSelector, componentPath) {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      targetElement.innerHTML = `
        <div class="component-error p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center text-red-800">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span class="font-medium">Component Load Error</span>
          </div>
          <p class="text-red-600 text-sm mt-1">Failed to load: ${componentPath}</p>
          <button onclick="window.componentLoader.retry('${componentPath}', '${targetSelector}')" 
                  class="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      `;
    }
  }

  async retry(componentPath, targetSelector) {
    this.retryCount.delete(componentPath);
    this.cache.delete(componentPath);
    return this.loadComponent(componentPath, targetSelector, { forceReload: true });
  }

  // Batch load components
  async loadComponents(components) {
    const promises = components.map(({ path, selector, options }) => 
      this.loadComponent(path, selector, options)
    );
    
    const results = await Promise.allSettled(promises);
    
    const failed = results
      .map((result, index) => ({ result, component: components[index] }))
      .filter(({ result }) => result.status === 'rejected');
    
    if (failed.length > 0) {
      console.warn('Some components failed to load:', failed.map(f => f.component.path));
    }
    
    return results;
  }

  // Clear cache
  clearCache(componentPath = null) {
    if (componentPath) {
      this.cache.delete(componentPath);
    } else {
      this.cache.clear();
    }
  }

  // Preload components
  async preloadComponents(componentPaths) {
    const promises = componentPaths.map(path => {
      if (!this.cache.has(path)) {
        return this.fetchComponent(path).then(html => {
          this.cache.set(path, html);
        }).catch(error => {
          console.warn(`Failed to preload component: ${path}`, error);
        });
      }
      return Promise.resolve();
    });
    
    await Promise.allSettled(promises);
  }
}

// Initialize global component loader
window.componentLoader = new ComponentLoader();

// Convenience function for loading components
window.loadComponent = (path, selector, options) => 
  window.componentLoader.loadComponent(path, selector, options);

// Auto-load components based on data attributes
document.addEventListener('DOMContentLoaded', async () => {
  const elementsWithComponents = document.querySelectorAll('[data-component]');
  
  const components = Array.from(elementsWithComponents).map(element => ({
    path: element.dataset.component,
    selector: `#${element.id}` || `[data-component="${element.dataset.component}"]`,
    options: {
      forceReload: element.dataset.forceReload === 'true'
    }
  }));
  
  if (components.length > 0) {
    try {
      await window.componentLoader.loadComponents(components);
      console.log(`Loaded ${components.length} components automatically`);
    } catch (error) {
      console.error('Error auto-loading components:', error);
    }
  }
});