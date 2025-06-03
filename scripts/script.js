/**
 * Main JavaScript for DTU Hostel Website
 * 
 * This script handles:
 * - Dynamic component loading based on the current page location
 * - Path detection to build proper relative URLs
 * - Slideshow functionality
 * - Mobile navigation menu functionality
 * 
 * Author: DTU Web Development Team
 * Last Updated: May 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  // Determine the relative path to the root based on current URL
  const currentPath = window.location.pathname;
  let pathToRoot = '';
  
  // Handle Windows paths properly (replace backslashes)
  const normalizedPath = currentPath.replace(/\\/g, '/');
  
  // Count directory levels to build the correct relative path
  const segments = normalizedPath.split('/').filter(segment => segment.length > 0);
  
  // Check for the workspace name in the path to determine true depth
  const workspaceNameOptions = ['dtu type website', 'dtu-website', 'website', 'dtu'];
  let startIndex = -1;
  
  // Try to find any of the workspace name options in the path
  segments.forEach((segment, index) => {
    workspaceNameOptions.forEach(nameOption => {
      if (segment.toLowerCase().includes(nameOption.toLowerCase())) {
        startIndex = index;
      }
    });
  });
  
  // Calculate the real depth from the workspace root
  let depth = 0;
  
  // If we found a workspace name marker, use it to calculate depth
  if (startIndex > -1) {
    depth = segments.length - startIndex - 1;
  } else {
    // Otherwise, try to determine depth based on known page patterns
    const isInPages = segments.includes('pages');
    if (isInPages) {
      const pagesIndex = segments.indexOf('pages');
      depth = segments.length - pagesIndex;
    } else if (segments.includes('index.html') || segments.length === 0) {
      depth = 0;
    } else {
      // Default to counting all segments if we can't determine otherwise
      depth = segments.length;
    }
  }
  
  // Build the path to root
  for (let i = 0; i < depth; i++) {
    pathToRoot += '../';
  }
  
  // If we're at the root, pathToRoot will be empty, so set it to "./"
  if (pathToRoot === '') {
    pathToRoot = './';
  }
  
  // Store the pathToRoot as a global variable for other scripts to use
  window.pathToRoot = pathToRoot;
  
  // Debug info for development
  console.log('Current path:', normalizedPath);
  console.log('Segments:', segments);
  console.log('Depth:', depth);
  console.log('Path to root:', pathToRoot);
  
  // First load the header-loader.js script
  loadScript(pathToRoot + 'scripts/header-loader.js')
    .then(() => {
      // After the header loader script is loaded, start loading components
      loadComponents(pathToRoot, depth);
    })
    .catch(error => {
      console.error('Error loading header-loader.js:', error);
      // Still try to load components even if the header-loader failed
      loadComponents(pathToRoot, depth);
    });

  // Initialize slideshow if present
  initializeSlideshow();
  
  // Initialize mobile menu functionality (will be created after navbar loads)
  setTimeout(initializeMobileMenu, 1000);
});

/**
 * Function to dynamically load a JavaScript file
 * 
 * @param {string} src - Path to the script file
 * @returns {Promise} - Resolves when script is loaded, rejects on error
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Loads all website components based on the calculated path to root
 * 
 * @param {string} pathToRoot - The relative path to the website root
 * @param {number} depth - The directory depth from root
 */
function loadComponents(pathToRoot, depth) {
  // Load header component
  loadComponent("header", pathToRoot + "components/header.html")
    .then(() => {
      // After header is loaded, try to load header images
      if (window.loadHeaderImages) {
        setTimeout(window.loadHeaderImages, 100);
      }
    });
  
  // Load the appropriate navbar component and modify it for the current page location
  loadNavbar(pathToRoot, depth);
  
  // Load sidebar widget component
  loadComponent("sidebar-widget", pathToRoot + "components/sidebar-widget.html");
  
  // Load footer component
  loadComponent("footer", pathToRoot + "components/footer.html");
}

/**
 * Loads and customizes the navbar for current page location
 * 
 * @param {string} pathToRoot - The relative path to the website root
 * @param {number} depth - The directory depth from root
 */
function loadNavbar(pathToRoot, depth) {
  // Base navbar file to use
  let navbarFile = "navbar.html";
  
  // Load the navbar HTML
  fetch(pathToRoot + "components/" + navbarFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} when fetching navbar`);
      }
      return response.text();
    })
    .then((html) => {
      const container = document.getElementById("navbar");
      if (!container) {
        console.warn("Navbar container not found");
        return;
      }
      
      // Before adding navbar, add mobile toggle button
      const mobileToggle = document.createElement('button');
      mobileToggle.className = 'mobile-menu-toggle';
      mobileToggle.innerHTML = 'Menu';
      mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
      container.appendChild(mobileToggle);
      
      // Add the rest of the navbar
      const navContent = document.createElement('div');
      navContent.innerHTML = html;
      container.appendChild(navContent);
      
      // Now adjust all links in the navbar based on the current depth
      const links = container.querySelectorAll("a");
      links.forEach(link => {
        let href = link.getAttribute("href");
        
        // Skip absolute links or links with # or javascript:
        if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript:")) {
          return;
        }
        
        // Make the link relative to the current page location
        if (href.startsWith("/")) {
          // If it's a root-relative link (starts with /), make it relative to pathToRoot
          link.href = pathToRoot + href.substring(1);
        } else if (href.startsWith("../") && depth === 0) {
          // Don't modify links that are already using relative paths properly
          // No change needed
        } else if (href.startsWith("pages/") && depth > 0) {
          // If we're in a subdirectory and the link points to pages/
          link.href = pathToRoot + href;
        } else if (href === "index.html" && depth > 0) {
          // If link is to index.html and we're in a subdirectory
          link.href = pathToRoot + href;
        }
        
        // If this is a link to the disclaimer page from anywhere, fix it
        if (href.includes("disclaimer.html")) {
          link.href = pathToRoot + "pages/disclaimer.html";
        }
      });
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
}

/**
 * Loads a component HTML into its container
 * 
 * @param {string} containerId - ID of the container element
 * @param {string} componentUrl - URL of the component HTML file
 * @returns {Promise} - Resolves when component is loaded
 */
function loadComponent(containerId, componentUrl) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container #${containerId} not found`);
    return Promise.resolve();
  }
  
  return fetch(componentUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} when fetching ${componentUrl}`);
      }
      return response.text();
    })
    .then((html) => {
      container.innerHTML = html;
      
      // If this is the footer, initialize the current year script
      if (containerId === "footer") {
        const yearElement = container.querySelector('#current-year');
        if (yearElement) {
          yearElement.textContent = new Date().getFullYear();
        }
        
        // Also fix any links in the footer
        const footerLinks = container.querySelectorAll('a');
        footerLinks.forEach(link => {
          let href = link.getAttribute("href");
          if (href && href.includes("disclaimer.html")) {
            link.href = window.pathToRoot + "pages/disclaimer.html";
          }
        });
      }
      
      return html;
    })
    .catch((error) => {
      console.error(`Error loading ${containerId} from ${componentUrl}:`, error);
    });
}

/**
 * Initializes mobile navigation menu toggle functionality
 * Only applies to screens below 768px width
 */
function initializeMobileMenu() {
  // Check if we're on a mobile device (screen width below 768px)
  const isMobileView = window.innerWidth < 768;
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbar = document.querySelector('.navbar');
  
  if (mobileMenuToggle && navbar) {
    const navbarUl = navbar.querySelector('ul');
    
    // Toggle menu on button click (only works on mobile)
    mobileMenuToggle.addEventListener('click', function() {
      if (window.innerWidth < 768) {  // Double-check we're still on mobile
        navbarUl.classList.toggle('expanded');
        
        // Change button text based on state
        if (navbarUl.classList.contains('expanded')) {
          mobileMenuToggle.innerHTML = 'Close';
        } else {
          mobileMenuToggle.innerHTML = 'Menu';
        }
      }
    });
    
    // Handle dropdowns on mobile
    const dropdownLinks = navbar.querySelectorAll('.dropdown > a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Only apply this behavior on mobile screens
        if (window.innerWidth < 768) {
          e.preventDefault();
          const dropdownMenu = this.nextElementSibling;
          
          // Toggle this specific dropdown menu
          if (dropdownMenu) {
            if (dropdownMenu.style.display === 'block') {
              dropdownMenu.style.display = 'none';
            } else {
              // Hide all other dropdown menus first
              navbar.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                  menu.style.display = 'none';
                }
              });
              dropdownMenu.style.display = 'block';
            }
          }
        }
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth < 768 && 
          !navbar.contains(e.target) &&
          !mobileMenuToggle.contains(e.target) &&
          navbarUl.classList.contains('expanded')) {
        navbarUl.classList.remove('expanded');
        mobileMenuToggle.innerHTML = 'Menu';
      }
    });
    
    // Handle window resize events to reset menu state when switching between mobile and desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768) {
        // Reset mobile menu when resized to desktop
        if (navbarUl.classList.contains('expanded')) {
          navbarUl.classList.remove('expanded');
          mobileMenuToggle.innerHTML = 'Menu';
        }
        
        // Reset dropdown menus
        navbar.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = '';  // Reset to default CSS value
        });
      }
    });
  }
}

/**
 * Slideshow functionality - handles image carousel
 */
function initializeSlideshow() {
  const slideshow = document.querySelector('.slideshow');
  if (!slideshow) return;

  const slides = document.querySelectorAll('.slides');
  const slideButtons = document.querySelectorAll('.slide-btn');
  let currentSlide = 0;
  let autoplayTimer = null;

  // Show the first slide
  slides[currentSlide].classList.add('active');
  slideButtons[currentSlide].classList.add('active');

  // Update slide number
  const slideNumber = document.querySelector('.slide-number');
  if (slideNumber) {
    slideNumber.textContent = `${currentSlide + 1} / ${slides.length}`;
  }

  // Handle next button click
  document.querySelector('.next')?.addEventListener('click', function() {
    showSlide(currentSlide + 1);
    resetAutoplay(); // Reset autoplay timer when manually changing slides
  });

  // Handle previous button click
  document.querySelector('.prev')?.addEventListener('click', function() {
    showSlide(currentSlide - 1);
    resetAutoplay(); // Reset autoplay timer when manually changing slides
  });

  // Handle slide button clicks
  slideButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      showSlide(index);
      resetAutoplay(); // Reset autoplay timer when manually changing slides
    });
  });

  // Start autoplay
  startAutoplay();

  // Pause autoplay when hovering over slideshow
  slideshow.addEventListener('mouseenter', function() {
    clearInterval(autoplayTimer);
  });

  // Resume autoplay when mouse leaves slideshow
  slideshow.addEventListener('mouseleave', function() {
    startAutoplay();
  });

  /**
   * Shows a specific slide
   * @param {number} index - Index of the slide to show
   */
  function showSlide(index) {
    // Handle wrap-around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    // Hide current slide
    slides[currentSlide].classList.remove('active');
    slideButtons[currentSlide].classList.remove('active');
    
    // Show new slide
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    slideButtons[currentSlide].classList.add('active');
    
    // Update slide number
    if (slideNumber) {
      slideNumber.textContent = `${currentSlide + 1} / ${slides.length}`;
    }
    
    // Update caption if it exists
    const caption = document.querySelector('.slideshow-bottom-bar .caption');
    if (caption && slides[currentSlide].dataset.caption) {
      caption.textContent = slides[currentSlide].dataset.caption;
    }
  }
  
  /**
   * Starts the autoplay feature for slideshow
   */
  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000); // Change slide every 5 seconds
  }
  
  /**
   * Resets the autoplay timer
   */
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
} 
