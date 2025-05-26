# Image Customization Application

A modern web application built with React and Vite that allows users to customize images with text and various effects.

## Features

- Browse through a catalog of images in the dashboard
- Customize selected images with:
  - Text overlay with multiple fonts and colors
  - Multiple text styles and effects
  - Precise positioning and resizing capabilities
  - Real-time preview updates
- Responsive design optimized for all screen sizes
- Loading states and progress indicators for better UX
- Error handling and user feedback

## Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **UI Components**: Konva.js (for canvas manipulation)
- **Routing**: React Router DOM
- **State Management**: Custom React Context
- **Styling**: Tailwind CSS

## Project Structure

```
poc-app/
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.jsx     # Main product listing page
│   │   ├── Customization.jsx # Image customization interface
│   │   ├── SideBar/          # Customization tools sidebar
│   │   └── Loader.jsx        # Loading state component
│   ├── Context/              # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── assets/              # Static assets
│   ├── data/               # Product data
│   └── utils/              # Utility functions
├── public/                 # Static files
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

The project uses Vite for fast development and hot module replacement. The application is built with a focus on performance and user experience, including:

- Efficient image loading and caching
- Smooth animations and transitions
- Optimized canvas rendering
- Responsive layout system
- Error boundaries for graceful error handling

### Build

To create a production build:

```bash
npm run build
```

## Usage

1. Browse through available images in the dashboard
2. Click on an image to customize it
3. Use the sidebar tools to:
   - Add and style text with various fonts and colors
   - Position and resize elements precisely
   - Apply different text effects
   - Preview changes in real-time
4. Save or Export your customized image when satisfied

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- React and Vite for the modern development experience
- Konva.js for powerful canvas manipulation
- Tailwind CSS for styling
- React Router DOM for navigation

## Support

For support, please open an issue in the GitHub repository.