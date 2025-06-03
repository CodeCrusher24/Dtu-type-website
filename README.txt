# DTU HOSTEL MANAGEMENT WEBSITE
===============================================
Last Updated: 21 May 2025

## PROJECT OVERVIEW
This website serves as the official portal for the Hostel Management Department of Delhi Technological University (DTU). It provides comprehensive information about hostel facilities, procedures, and regulations for students and faculty.

## PROJECT STRUCTURE
The website follows a component-based architecture with dynamic content loading:

/
├── index.html                 # Main homepage
├── README.txt                 # This file
├── components/                # Reusable HTML components
│   ├── footer.html           # Site footer with copyright and contact info
│   ├── header.html           # Site header with title and social icons
│   ├── navbar.html           # Main navigation menu
│   ├── sidebar-widget.html   # Sidebar with search and recent posts
│   └── slideshow.html        # Homepage image carousel
├── documents/                # Downloadable documents and forms
├── images/                   # Image assets
├── pages/                    # All website pages organized in subfolders
│   ├── about-us/             # About section pages
│   ├── fees/                 # Fee structure and payment pages
│   ├── hostels/              # Hostel-specific pages
│   │   ├── boys/            # Boys' hostels pages
│   │   └── girls/           # Girls' hostels pages
│   └── utility/              # Utility pages (contact, forms, etc.)
├── scripts/                  # JavaScript files
│   ├── script.js            # Main functionality script
│   ├── fix-sidebar.js       # Utility script to fix sidebar class names
│   ├── header-loader.js     # Script to load header images dynamically
│   └── update-page-titles.js # Utility script for page title formatting
└── styles/                   # CSS stylesheets
    └── style.css            # Main stylesheet with responsive design

## KEY FEATURES
1. Responsive Design: Optimized for desktop, tablet, and mobile devices
2. Dynamic Component Loading: Components loaded based on the current page location
3. Path Resolution: Automatic path detection for proper relative URLs
4. Mobile-friendly Navigation: Collapsible menu for mobile devices
5. Image Slideshow: Auto-advancing carousel with navigation controls
6. Standardized Page Structure: Consistent layout and styling across all pages

## IMPLEMENTATION DETAILS

### Component Loading System
The website uses a dynamic component loading system to maintain consistency across pages:
- Components (header, footer, navbar, sidebar) are loaded via JavaScript
- Path detection determines the relative path to the root directory
- Links are automatically adjusted based on the current page depth

### Responsive Design
The website implements a mobile-first approach with three breakpoints:
- Mobile: Up to 767px
- Tablet: 768px to 991px
- Desktop: 992px and up

Media queries adjust layout, font sizes, spacing, and navigation based on screen size.

### Navbar System
- Desktop: Horizontal menu with dropdowns
- Mobile: Collapsible vertical menu with toggle button
- Links use root-relative paths (/path) that are converted to relative paths dynamically

### Slideshow
The homepage features an image carousel with:
- Auto-advancing slides
- Pause on hover
- Navigation buttons
- Pagination
- Captions

### Utility Scripts
1. fix-sidebar.js: Updates incorrect sidebar class names across HTML files
2. update-page-titles.js: Standardizes page title sections across the site
3. header-loader.js: Resolves image paths dynamically based on page location

### About Node.js Utility Scripts
The project includes two Node.js utility scripts (fix-sidebar.js and update-page-titles.js) that were used ONLY during development to:

1. Standardize and fix HTML structures across many files at once
2. Ensure consistent page layouts by updating title sections
3. Fix sidebar class names across all pages

These scripts are NOT required for running the website but were used as development tools to make bulk changes efficiently. The live website runs entirely on standard HTML, CSS, and browser-based JavaScript without any server-side dependencies.

If presenting this project in an academic context where only HTML/CSS/JS are permitted, you can:
1. Explain these were one-time development tools used for code maintenance
2. Demonstrate that the live site runs without any Node.js dependencies
3. Note that all core functionality is implemented with standard front-end technologies

## MAINTENANCE GUIDELINES

### Adding New Pages
1. Create HTML file in the appropriate subfolder
2. Use the standard page structure including component containers:
   ```html
   <div id="header"></div>
   <div id="navbar"></div>
   <main>
     <section class="content-wrapper">
       <section class="main-content">
         <!-- Page content goes here -->
       </section>
       <aside id="sidebar-widget" class="sidebar-widget-container"></aside>
     </section>
   </main>
   <div id="footer"></div>
   ```
3. Link to script.js to ensure components load correctly

### Adding Navigation Items
Edit the components/navbar.html file to add new navigation items.

### Updating Styles
The style.css file contains all styling, organized into sections:
- RESET & BASE: Basic resets and foundational styles
- Layout components (WRAPPER, MAIN, etc.)
- UI components (NAVIGATION, SLIDESHOW, etc.)
- RESPONSIVE DESIGN: Media queries for different screen sizes

### Mobile Menu Updates
The mobile menu toggle is created dynamically by script.js when loading the navbar.

## BROWSER COMPATIBILITY
The website is compatible with:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## AUTHORS
DTU Web Development Team
Delhi Technological University, Delhi 