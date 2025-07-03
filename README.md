# 🏛️ DTU Hostel Management Website

> A frontend prototype for Delhi Technological University's Hostel Management Department

## 📋 Overview

This is a **frontend prototype** created for the Hostel Management Department of **Delhi Technological University (DTU)**. It serves as a **sample submission** and is not an official DTU website. The project demonstrates frontend capabilities using **vanilla HTML, CSS, and JavaScript**.

🔗 **Live Demo**: [View Website](https://roaring-meringue-aac216.netlify.app/) ✅

## ✨ Features

- 🖥️ **Strictly desktop-only layout** (viewport width=1200px)
- 🧩 Dynamic component loading (header, navbar, sidebar, footer)
- 🖼️ Homepage image slideshow
- 📰 Sidebar always on the right of main content
- 📄 Consistent favicon and footer logo on all pages/components
- 📂 Robust dynamic path handling for images and components
- 📥 PDF/document download links use the convention `documents/NAME.pdf`
- 📐 Standardized page layout for all content
- 🚀 Pure HTML/CSS/JavaScript implementation

## 🏗️ Project Structure

```
/
├── index.html              # Homepage
├── components/             # Reusable HTML components
│   ├── footer.html
│   ├── header.html
│   ├── navbar.html
│   ├── sidebar-widget.html
│   └── slideshow.html
├── documents/             # Downloadable documents/forms (PDFs, etc.)
├── images/                # Image assets
│   └── hostels/           # Hostel-specific images
├── pages/                 # Website content pages
│   ├── about-us/          # About, council, anti-ragging, etc.
│   ├── fees/              # Fee structure, payment, etc.
│   ├── hostels/
│   │   ├── boys/
│   │   └── girls/
│   └── utility/           # Contact, feedback, performa
├── scripts/               # JavaScript files
│   ├── script.js
│   ├── fix-sidebar.js
│   ├── header-loader.js
│   └── update-page-titles.js
└── styles/
    └── style.css
```

## 🛠️ Development Tools

The project includes Node.js scripts used for development and maintenance:

| Script                  | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `fix-sidebar.js`        | Fixes sidebar class names across HTML pages |
| `update-page-titles.js` | Updates `<title>` sections site-wide        |
| `header-loader.js`      | Resolves image paths dynamically in JS      |

> **Note**: These tools were used for development only. The deployed website runs without any server-side code or Node.js dependencies.

## 🌐 Browser Support

- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Edge
- ✅ Safari

> **Note:** The site is **desktop-only**. On mobile devices, users will need to zoom and scroll to view content.

## 🖥️ Desktop-Only Experience

- All pages use `<meta name="viewport" content="width=1200" />` for a fixed-width desktop layout.
- No mobile or tablet layout is provided. The site will not reflow for small screens.
- To add a new page, always include the desktop viewport meta tag in the `<head>`:
  ```html
  <meta name="viewport" content="width=1200" />
  ```
- The sidebar is always displayed to the right of the main content.
- The favicon and footer logo are present and robustly loaded on every page/component.
- All image and component paths are dynamically resolved for every page depth.

## 📥 Document Download Convention

- All downloadable PDFs and documents are placed in the `documents/` folder.
- Download links use the format: `documents/NAME.pdf` (spaces replaced with underscores, special characters removed).

## 👨‍💻 Author

**Parag Kumar**

## 📄 License

This project is for educational and demonstration purposes.

---

<div align="center">
  <sub>Built with ❤️ for DTU Hostel Management Department</sub>
</div>
