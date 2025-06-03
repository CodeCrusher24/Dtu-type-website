/**
 * Sidebar Class Fix Utility
 * 
 * This Node.js script finds and fixes incorrect sidebar class names in HTML files.
 * It replaces the class "sidebar-widget" with "sidebar-widget-container" to ensure
 * consistent styling across the website.
 * 
 * Usage: Run with Node.js from the project root directory
 * $ node scripts/fix-sidebar.js
 * 
 * Author: DTU Web Development Team
 * Last Updated: 21 May 2025
 */

const fs = require('fs');
const path = require('path');

/**
 * Updates the sidebar class in an HTML file
 * 
 * @param {string} filePath - Path to the HTML file to update
 */
function updateSidebarClass(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the incorrect sidebar class
    if (content.includes('<aside id="sidebar-widget" class="sidebar-widget">')) {
      // Replace the class
      const updatedContent = content.replace(
        '<aside id="sidebar-widget" class="sidebar-widget">',
        '<aside id="sidebar-widget" class="sidebar-widget-container">'
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

/**
 * Recursively searches directories for HTML files
 * 
 * @param {string} dir - Directory path to search
 */
function searchDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      searchDirectory(filePath); // Recursively search subdirectories
    } else if (path.extname(file) === '.html') {
      updateSidebarClass(filePath); // Process HTML files
    }
  });
}

// Start from the root directory
console.log('Starting sidebar class fix...');
searchDirectory('.');
console.log('Sidebar class fix complete!'); 