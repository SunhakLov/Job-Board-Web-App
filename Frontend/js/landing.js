// Landing Page JavaScript
class LandingPage {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.initScrollToTop();
    this.initCounterAnimation();
    this.initSmoothScrolling();
  }

  bindEvents() {
    // Sign In Modal Events
    this.setupSignInModal();
    
    // Mobile Menu Events
    this.setupMobileMenu();
    
    // Password Toggle
    this.setupPasswordToggle();
  }

  setupSignInModal() {
    // Use event delegation for dynamically loaded elements
    document.addEventListener('click', (e) => {
      // Handle sign in button clicks
      if (e.target.matches('#signInBtn, #mobileSignInBtn, #signInBtn *, #mobileSignInBtn *')) {
        e.preventDefault();
        const signInModal = document.getElementById('signInModal');
        signInModal?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
      
      // Handle close modal button
      if (e.target.matches('#closeSignInModal, #closeSignInModal *')) {
        const signInModal = document.getElementById('signInModal');
        signInModal?.classList.add('hidden');
        document.body.style.overflow = '';
      }
      
      // Close modal when clicking outside
      if (e.target.matches('#signInModal')) {
        const signInModal = document.getElementById('signInModal');
        signInModal?.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    // Handle form submission with event delegation
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#signInForm')) {
        e.preventDefault();
        this.handleSignIn(new FormData(e.target));
      }
    });
  }

  setupMobileMenu() {
    // Use event delegation to handle dynamically loaded components
    document.addEventListener('click', (e) => {
      if (e.target.matches('#mobileMenuBtn, #mobileMenuBtn *')) {
        e.preventDefault();
        this.openMobileMenu();
      }
      
      if (e.target.matches('#closeMobileMenu, #closeMobileMenu *')) {
        e.preventDefault();
        this.closeMobileMenu();
      }
      
      if (e.target.matches('#mobileMenuOverlay')) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    mobileMenuOverlay?.classList.remove('hidden');
    mobileMenu?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    mobileMenu?.classList.remove('active');
    mobileMenuOverlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  setupPasswordToggle() {
    // Use event delegation for dynamically loaded elements
    document.addEventListener('click', (e) => {
      if (e.target.matches('#togglePassword, #togglePassword *')) {
        const passwordInput = document.getElementById('signInPassword');
        if (passwordInput) {
          const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordInput.setAttribute('type', type);
          
          const icon = document.querySelector('#togglePassword i');
          if (icon) {
            if (type === 'password') {
              icon.classList.remove('fa-eye-slash');
              icon.classList.add('fa-eye');
            } else {
              icon.classList.remove('fa-eye');
              icon.classList.add('fa-eye-slash');
            }
          }
        }
      }
    });
  }

  handleSignIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simulate sign in process
    console.log('Sign in attempt:', { email, password });
    
    // For demo purposes, redirect based on email domain
    if (email.includes('@student.cpp.edu') || email.includes('@cpp.edu')) {
      window.location.href = './pages/student-portal.html';
    } else {
      window.location.href = './pages/recruiter-portal.html';
    }
  }

  initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollButton.classList.remove('opacity-0', 'invisible');
      } else {
        scrollButton.classList.add('opacity-0', 'invisible');
      }
    });

    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    const speed = 200;

    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
      let count = 0;
      const increment = target / speed;

      const updateCounter = () => {
        if (count < target) {
          count += increment;
          counter.textContent = Math.ceil(count).toLocaleString() + counter.textContent.replace(/[0-9,]/g, '');
          setTimeout(updateCounter, 1);
        } else {
          counter.textContent = target.toLocaleString() + counter.textContent.replace(/[0-9,]/g, '');
        }
      };

      updateCounter();
    });
  }

  // Public API
  showSignInModal() {
    document.getElementById('signInModal')?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hideSignInModal() {
    document.getElementById('signInModal')?.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.landingPage = new LandingPage();
});

// Utility functions for backward compatibility
function showSignInModal() {
  window.landingPage?.showSignInModal();
}

function hideSignInModal() {
  window.landingPage?.hideSignInModal();
}