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

  // Add align-right to last 2 dropdowns in navbar
  setTimeout(() => {
    const dropdowns = document.querySelectorAll('.navbar li.dropdown');
    if (dropdowns.length > 2) {
      dropdowns[dropdowns.length - 1].classList.add('align-right');
      dropdowns[dropdowns.length - 2].classList.add('align-right');
    }
  }, 500);

  // Detect touch support
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) document.body.classList.add('touch-device');

  // Add down arrow to each dropdown parent
  document.querySelectorAll('.navbar .dropdown > a').forEach(link => {
    if (!link.querySelector('.dropdown-arrow')) {
      var arrow = document.createElement('span');
      arrow.className = 'dropdown-arrow';
      arrow.innerHTML = '&#9660;'; // ▼
      link.appendChild(arrow);
    }
  });

  // Dropdown click logic for touch devices only
  if (isTouch) {
    const dropdownLinks = document.querySelectorAll('.navbar .dropdown > a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const parentLi = this.parentElement;
        const isOpen = parentLi.classList.contains('open');
        // Close all other dropdowns
        document.querySelectorAll('.navbar .dropdown').forEach(li => {
          if (li !== parentLi) li.classList.remove('open');
        });
        if (!isOpen) {
          // Open dropdown, prevent navigation
          e.preventDefault();
          parentLi.classList.add('open');
        } // else: allow navigation
      });
    });
  }
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
  loadComponent("footer", pathToRoot + "components/footer.html").then(() => {
    // Fix the footer logo path after footer loads
    const footerLogo = document.getElementById('footer-dtu-logo');
    if (footerLogo) {
      let logoPath = pathToRoot + 'images/dtu-logo.png';
      footerLogo.onerror = function() {
        this.onerror = null;
        this.src = '../../images/dtu-logo.png';
      };
      footerLogo.src = logoPath;
    }
  });
}

/**
 * Loads and customizes the navbar for current page location
 * 
 * @param {string} pathToRoot - The relative path to the website root
 * @param {number} depth - The directory depth from root
 */
function loadNavbar(pathToRoot, depth) {
  console.log('Attempting to load navbar...');
  // Find the header container inside .wrapper
  const wrapper = document.querySelector('.wrapper');
  const header = wrapper ? wrapper.querySelector('#header') : null;
  if (!wrapper || !header) {
    console.warn('Wrapper or header not found for navbar injection');
    return;
  }

  // Remove any existing navbar or toggle button immediately after header
  let next = header.nextElementSibling;
  while (next && (next.classList.contains('navbar') || next.classList.contains('mobile-menu-toggle'))) {
    let toRemove = next;
    next = next.nextElementSibling;
    toRemove.remove();
  }

  // Load the navbar HTML
  fetch(pathToRoot + "components/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} when fetching navbar`);
      }
      return response.text();
    })
    .then((html) => {
      console.log('Navbar HTML loaded successfully. Injecting into DOM.');
      console.log('Navbar HTML:', html);
      // Remove test div and debug code
      // Extract only the <ul>...</ul> part from the loaded HTML
      const ulMatch = html.match(/<ul[\s\S]*<\/ul>/);
      if (ulMatch) {
        const navbar = document.createElement('nav');
        navbar.className = 'navbar';
        navbar.innerHTML = ulMatch[0];
        header.insertAdjacentElement('afterend', navbar);
      } else {
        console.error('Navbar HTML did not contain a <ul>...</ul> block.');
      }

      // Adjust all links in the navbar based on the current depth
      const links = navbar.querySelectorAll("a");
      links.forEach(link => {
        let href = link.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript:")) {
          return;
        }
        if (href.startsWith("/")) {
          link.href = pathToRoot + href.substring(1);
        } else if (href.startsWith("../") && depth === 0) {
          // No change needed
        } else if (href.startsWith("pages/") && depth > 0) {
          link.href = pathToRoot + href;
        } else if (href === "index.html" && depth > 0) {
          link.href = pathToRoot + href;
        }
        if (href.includes("disclaimer.html")) {
          link.href = pathToRoot + "pages/disclaimer.html";
        }
      });

      // Dropdown click logic for desktop only
      const dropdownLinks = document.querySelectorAll('.navbar .dropdown > a');
      dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          const parentLi = this.parentElement;
          const isOpen = parentLi.classList.contains('open');
          // Close all other dropdowns
          document.querySelectorAll('.navbar .dropdown').forEach(li => {
            if (li !== parentLi) li.classList.remove('open');
          });
          if (!isOpen) {
            // Open dropdown, prevent navigation
            e.preventDefault();
            parentLi.classList.add('open');
          } else {
            // Allow navigation to parent link
            // No preventDefault, browser will follow link
          }
        });
      });

      // Make sure the navbar is visible in desktop view
      if (window.innerWidth >= 768) {
        navbar.style.transform = 'none';
      }
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
  console.log(`Loading component #${containerId} from ${componentUrl}`);
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
      // If this is the sidebar, log for debugging
      if (containerId === "sidebar-widget") {
        console.log('Sidebar widget loaded.');
      }
      if (containerId === "footer") {
        console.log('Footer loaded.');
      }
      if (containerId === "header") {
        console.log('Header loaded.');
      }
      return html;
    })
    .catch((error) => {
      console.error(`Error loading ${containerId} from ${componentUrl}:`, error);
    });
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
