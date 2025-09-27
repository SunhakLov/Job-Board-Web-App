# Component Architecture Documentation

## Overview
The JobConnect application has been refactored to use a modular, reusable component architecture. All inline styles and scripts have been extracted into separate files for better maintainability and reusability.

## File Structure

### 🎨 **Styles** (`/styles/`)
- `theme.css` - CSS variables and theme system (Cal Poly colors, typography, spacing)
- `landing.css` - Landing page specific styles 
- `mobile.css` - Mobile menu and responsive styles
- `main.css` - Base application styles
- `components.css` - Reusable component styles
- `utilities.css` - Utility classes

### 🧩 **Components** (`/components/shared/`)
All HTML components are now in separate files for reusability:

- `header.html` - Main navigation header with mobile menu
- `hero.html` - Hero section with search functionality
- `job-categories.html` - Popular job categories grid
- `trending-jobs.html` - Featured job listings
- `features.html` - Product features showcase
- `cta.html` - Call-to-action section
- `footer.html` - Site footer with links
- `auth-modal.html` - Sign-in modal dialog
- `scroll-to-top.html` - Floating scroll button

### ⚡ **JavaScript** (`/js/`)
- `component-loader-v2.js` - Advanced component loading system
- `landing.js` - Landing page functionality
- `main.js` - Core application logic

## Component Loading System

### **Automatic Loading**
Components are loaded automatically using `data-component` attributes:

```html
<div id="header-container" data-component="./components/shared/header.html"></div>
```

### **Manual Loading**
```javascript
// Load a single component
await window.loadComponent('./components/shared/header.html', '#header-container');

// Load multiple components
await window.componentLoader.loadComponents([
  { path: './components/shared/header.html', selector: '#header' },
  { path: './components/shared/footer.html', selector: '#footer' }
]);
```

### **Features**
- ✅ **Caching** - Components cached for performance
- ✅ **Error Handling** - Graceful fallbacks with retry buttons
- ✅ **Loading States** - Visual feedback during load
- ✅ **Preloading** - Optional component preloading
- ✅ **Event System** - `componentLoaded` events

## CSS Architecture

### **Theme System**
All colors, spacing, and design tokens are centralized in `theme.css`:

```css
:root {
  --cpp-primary: #1e3d2b;
  --cpp-secondary: #2d5a3f;
  --transition-fast: 0.15s ease;
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### **Component Classes**
Reusable component classes in dedicated files:

```css
/* landing.css */
.hero-section { }
.search-container { }
.job-category-card { }
.trending-job-card { }
.feature-card { }
```

### **Utility Classes**
Consistent utility classes:

```css
.bg-cpp-primary { background-color: var(--cpp-primary); }
.text-cpp-primary { color: var(--cpp-primary); }
.section { padding: 4rem 0; }
.section-large { padding: 5rem 0; }
```

## JavaScript Architecture

### **Landing Page Class**
Organized functionality in a clean class structure:

```javascript
class LandingPage {
  constructor() { this.init(); }
  
  init() {
    this.bindEvents();
    this.initScrollToTop();
    this.initCounterAnimation();
  }
  
  setupSignInModal() { }
  setupMobileMenu() { }
  handleSignIn(formData) { }
}
```

### **Component Loader**
Advanced component management with error handling:

```javascript
class ComponentLoader {
  async loadComponent(path, selector, options = {}) { }
  async loadComponents(components) { }
  clearCache(componentPath = null) { }
  async preloadComponents(paths) { }
}
```

## Benefits of New Architecture

### 🔧 **Maintainability**
- **Separation of Concerns** - HTML, CSS, and JS in dedicated files
- **Single Responsibility** - Each component has one purpose
- **Easy Updates** - Change one file to update across the app

### ♻️ **Reusability**
- **Shared Components** - Header/footer used across pages
- **Theme System** - Consistent styling via CSS variables
- **Utility Classes** - Reusable design patterns

### ⚡ **Performance**
- **Component Caching** - Load once, use everywhere
- **Lazy Loading** - Components loaded when needed
- **Error Recovery** - Automatic retry with exponential backoff

### 🧪 **Testability**
- **Isolated Components** - Test individual pieces
- **Clear Dependencies** - Easy to mock and test
- **Event System** - Observable component lifecycle

### 📱 **Scalability**
- **Modular Structure** - Add new components easily
- **Version Control** - Clear change tracking
- **Team Development** - Multiple developers can work simultaneously

## Usage Examples

### **Creating a New Page**
```html
<!DOCTYPE html>
<html>
<head>
  <link href="./styles/theme.css" rel="stylesheet">
  <link href="./styles/main.css" rel="stylesheet">
</head>
<body>
  <div id="header" data-component="./components/shared/header.html"></div>
  <main>Your page content</main>
  <div id="footer" data-component="./components/shared/footer.html"></div>
  
  <script src="./js/component-loader-v2.js"></script>
</body>
</html>
```

### **Creating a New Component**
1. Create HTML file in `/components/shared/`
2. Add styles to appropriate CSS file
3. Add any JavaScript to dedicated JS file
4. Use `data-component` attribute to load

### **Customizing Theme**
```css
/* In your page-specific CSS */
:root {
  --cpp-primary: #custom-color;
  --custom-spacing: 2rem;
}
```

## Migration Notes

### **Before (Inline)**
```html
<style>
  .my-component { color: red; }
</style>
<script>
  function myFunction() { }
</script>
```

### **After (Separated)**
```css
/* components.css */
.my-component { color: red; }
```

```javascript
/* my-component.js */
class MyComponent {
  myFunction() { }
}
```

This new architecture makes the codebase more professional, maintainable, and scalable while keeping all functionality intact.