# TechJobs - Professional Job Board

A modern, responsive job board application built with HTML, CSS, Tailwind CSS, and vanilla JavaScript. Features a clean design with advanced animations, interactive components, and professional styling.

### Design & UI
- **Professional Design**: Clean, modern interface with no cartoonish elements
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Advanced Animations**: Smooth transitions, hover effects, and scroll animations
- **Interactive Components**: Modal dialogs, drag-and-drop file upload, toast notifications
- **Dark Mode Support**: Automatic dark mode based on user preference

### Functionality
- **Job Listings**: Display jobs with company logos, salary ranges, and job types
- **Advanced Search**: Search by keywords and location with real-time filtering
- **Job Details Modal**: Comprehensive job information including requirements and benefits
- **Quick Apply Form**: Professional application form with file upload support
- **Favorite Jobs**: Save jobs to favorites with visual feedback
- **Categories**: Browse jobs by popular categories
- **Featured Companies**: Showcase top hiring companies

### Technical Features
- **Modular CSS**: Separated into main styles, components, and utilities
- **Clean JavaScript**: Object-oriented approach with proper error handling
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized animations and lazy loading
- **SEO Ready**: Semantic HTML structure and meta tags

## 📁 Project Structure
```
job app-html-tailwind/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── styles/                 # CSS files
│   ├── main.css           # Core styles and variables
│   ├── components.css     # Component-specific styles
│   └── utilities.css      # Utility classes
└── js/                    # JavaScript files
    └── main.js           # Main application logic
```

## Design System

### Color Palette
- **Primary**: Blue (#2563eb)
- **Secondary**: Slate Gray (#64748b)
- **Success**: Green (#059669)
- **Warning**: Orange (#d97706)
- **Error**: Red (#dc2626)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body Text**: Regular weight (400)
- **Small Text**: Medium weight (500)

### Components
- **Header**: Sticky navigation with logo and actions
- **Hero Section**: Gradient background with search functionality
- **Job Cards**: Clean cards with hover effects and animations
- **Sidebar**: Quick apply form and category/company listings
- **Modal**: Detailed job information with smooth animations
- **Footer**: Multi-column layout with company links

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Advanced styling with custom properties and animations
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Vanilla JavaScript**: Modern ES6+ features and classes
- **Font Awesome**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for modern typography

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Accessibility Features

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- High contrast colors
- Reduced motion support for users with vestibular disorders

## Customization

### CSS Variables
All colors, spacing, and other design tokens are defined as CSS custom properties in `styles/main.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --background-light: #f8fafc;
  /* ... more variables */
}
```

### Component Styling
Each component has its own class in `styles/components.css`:
- `.header` - Main navigation header
- `.hero-section` - Hero banner with search
- `.job-card` - Individual job listing cards
- `.sidebar-card` - Sidebar component containers

### JavaScript Configuration
The main application class can be configured in `js/main.js`:
- Job data structure
- Animation settings
- Form validation rules
- API endpoints (for future integration)

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **For development**: Use a local server like Live Server in VS Code

### Local Development
```bash
# If you have Node.js installed, you can use:
npx serve .

# Or use Python:
python -m http.server 8000

# Or use VS Code Live Server extension
```

## 🔮 Future Enhancements

- **Backend Integration**: Connect to a real job API
- **User Authentication**: Login/signup functionality
- **Advanced Filtering**: Salary range, experience level, company size
- **Email Notifications**: Job alerts and application updates
- **Admin Panel**: Job posting and management interface
- **Analytics**: Track job views and application rates

## 📄 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue on the project repository.