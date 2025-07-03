/**
 * Header Image Loader Script
 * 
 * This script ensures that header images (logo and social icons) are loaded with the correct
 * path regardless of the current page's location within the site hierarchy.
 * 
 * It resolves paths dynamically by calculating the relative path to the root directory,
 * allowing components to be reused across different page depths.
 * 
 * Author: DTU Web Development Team
 * Last Updated: 21 May 2025
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait a short time for the header elements to be loaded through AJAX
  setTimeout(loadHeaderImages, 200);
});

/**
 * Main function to load all header images with the correct paths
 * This runs after the header component is loaded into the DOM
 */
function loadHeaderImages() {
  console.log('Loading header images...');
  
  // Get the path to root
  let pathToRoot = '';
  
  // First, try to use the global pathToRoot if available from script.js
  if (window.pathToRoot) {
    console.log('Using global pathToRoot:', window.pathToRoot);
    pathToRoot = window.pathToRoot;
  } else {
    // Fallback to calculating it based on the current page URL
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    
    // Count directory levels to build the correct relative path
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    console.log('Path segments:', segments);
    
    for (let i = 0; i < segments.length - 1; i++) {
      pathToRoot += '../';
    }
    
    // If we're at the root, pathToRoot will be empty, so set it to "./"
    if (pathToRoot === '') {
      pathToRoot = './';
    }
    
    console.log('Calculated pathToRoot:', pathToRoot);
  }
  
  // Set the image sources using the determined path
  setImageSources(pathToRoot);
}

/**
 * Sets the src attribute for all header images
 * 
 * @param {string} pathToRoot - The relative path to the website root directory
 */
function setImageSources(pathToRoot) {
  // Get references to all header image elements
  const dtuLogo = document.getElementById('dtu-logo');
  const instagramIcon = document.getElementById('instagram-icon');
  const facebookIcon = document.getElementById('facebook-icon');
  const linkedinIcon = document.getElementById('linkedin-icon');
  const xIcon = document.getElementById('x-icon');
  
  // Set the DTU logo path (with fallback for non-home pages)
  if (dtuLogo) {
    let logoPath = pathToRoot + 'images/dtu-logo.png';
    dtuLogo.onerror = function() {
      // Fallback for non-home pages if pathToRoot is wrong
      this.onerror = null;
      this.src = '../../images/dtu-logo.png';
    };
    dtuLogo.src = logoPath;
  } else {
    console.warn('dtu-logo element not found');
  }
  
  // Set the social media icon paths if the elements exist (with fallback)
  if (instagramIcon) {
    instagramIcon.onerror = function() { this.onerror = null; this.src = '../../images/instagram-icon.png'; };
    instagramIcon.src = pathToRoot + 'images/instagram-icon.png';
  }
  if (facebookIcon) {
    facebookIcon.onerror = function() { this.onerror = null; this.src = '../../images/facebook-icon.png'; };
    facebookIcon.src = pathToRoot + 'images/facebook-icon.png';
  }
  if (linkedinIcon) {
    linkedinIcon.onerror = function() { this.onerror = null; this.src = '../../images/linkedin-icon.png'; };
    linkedinIcon.src = pathToRoot + 'images/linkedin-icon.png';
  }
  if (xIcon) {
    xIcon.onerror = function() { this.onerror = null; this.src = '../../images/x-icon.png'; };
    xIcon.src = pathToRoot + 'images/x-icon.png';
  }
} 