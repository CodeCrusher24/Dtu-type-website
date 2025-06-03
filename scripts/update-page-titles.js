/**
 * Update Page Titles Script
 * 
 * This Node.js utility script updates the HTML structure of all pages in the project
 * to incorporate a standardized page-title-section.
 * 
 * It processes:
 * - Finds all HTML files recursively
 * - Identifies pages with h1 headings in main content
 * - Transforms headings into the standard page-title-section format
 * - Handles different content layouts
 * 
 * Usage: Run with Node.js from the project root directory
 * $ node scripts/update-page-titles.js
 * 
 * Author: DTU Web Development Team
 * Last Updated: 21 May 2025
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify filesystem functions for cleaner async code
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Root directory to start searching from
const rootDir = './';

// Directories to skip during processing
const skipDirs = [
  'node_modules',
  '.git',
];

/**
 * Recursively process all directories and HTML files
 * 
 * @param {string} dir - Directory path to process
 */
async function processDirectory(dir) {
  try {
    const files = await readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        // Process subdirectory if not in skip list
        if (!skipDirs.includes(file)) {
          await processDirectory(filePath);
        }
      } else if (file.endsWith('.html')) {
        // Process HTML files
        await processHtmlFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

/**
 * Process a single HTML file to add the page-title-section
 * 
 * @param {string} filePath - Path to the HTML file to process
 */
async function processHtmlFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Skip if already has page-title-section
    if (content.includes('page-title-section')) {
      console.log(`  - Already has page-title-section: ${filePath}`);
      return;
    }
    
    // Find the main tag and the first h1 within it
    const mainTagMatch = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(content);
    
    if (!mainTagMatch) {
      console.log(`  - No <main> tag found: ${filePath}`);
      return;
    }
    
    const mainContent = mainTagMatch[1];
    const h1Match = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(mainContent);
    
    if (!h1Match) {
      console.log(`  - No <h1> tag found in <main>: ${filePath}`);
      return;
    }
    
    // Extract the h1 text and full h1 tag
    const h1Tag = h1Match[0];
    const h1Text = h1Match[1];
    
    // Find where the main tag content starts
    const mainStartIndex = content.indexOf(mainTagMatch[0]);
    const mainContentStartIndex = mainStartIndex + '<main>'.length;
    
    // Create the updated content
    let updatedContent;
    
    // Handle different formats of main content based on page structure
    if (mainContent.includes('<section class="content-wrapper">')) {
      // Standard format with content-wrapper section
      updatedContent = content.substring(0, mainContentStartIndex) +
        '\n          <div class="page-title-section">\n' +
        `            <h1>${h1Text}</h1>\n` +
        '          </div>' +
        mainContent.replace(h1Tag, '');
    } else if (mainContent.includes('<div class="hostels-header">')) {
      // Special format with hostels-header div
      const hostelsHeaderRegex = /<div class="hostels-header">([\s\S]*?)<\/div>/i;
      const hostelsHeaderMatch = hostelsHeaderRegex.exec(mainContent);
      
      if (hostelsHeaderMatch) {
        const hostelsHeaderText = hostelsHeaderMatch[1].trim();
        updatedContent = content.replace(
          hostelsHeaderMatch[0],
          `<div class="page-title-section">\n            <h1>${hostelsHeaderText}</h1>\n          </div>`
        );
      } else {
        console.log(`  - Could not match hostels-header: ${filePath}`);
        return;
      }
    } else {
      console.log(`  - Unsupported main content format: ${filePath}`);
      return;
    }
    
    // Write the updated content back to the file
    await writeFile(filePath, updatedContent, 'utf8');
    console.log(`  - Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Start the process
processDirectory(rootDir).then(() => {
  console.log('All HTML files processed');
}).catch(err => {
  console.error('Error:', err);
}); 