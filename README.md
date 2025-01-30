# Business Card Creator

An interactive web application for creating and customizing digital business cards. Built with Next.js and Fabric.js, this project provides a powerful canvas-based editor with real-time customization capabilities.

## Features

- **Interactive Canvas Editor**

  - Drag and drop elements
  - Resize and rotate objects
  - Custom text editing with font controls
  - Image upload and manipulation
  - Mobile-responsive design with touch support

- **Advanced Canvas Controls**

  - Zoom in/out with mouse wheel or pinch gestures (Todo)
  - Multi-select and group objects
  - Copy/paste functionality
  - Undo/redo operations (Todo)
  - Object alignment and distribution (Todo)

- **Real-time Customization**

  - Text properties (font, size, color, alignment)
  - Image properties (size, position, filters)
  - Background customization
  - Layer management

- **Responsive Design**
  - Desktop and mobile-friendly interface
  - Touch-optimized controls for mobile devices
  - Adaptive canvas sizing
  - Smooth animations with Framer Motion

## Technical Stack

- **Frontend Framework**: Next.js 15 with React 19
- **Canvas Manipulation**: Fabric.js 6.5
- **State Management**: Zustand 5.0
- **Styling**: TailwindCSS 3.4
- **Animations**: Framer Motion 12.0
- **Icons**: React Icons 5.4
- **TypeScript**: Full type support
- **Export**: html-to-image for saving designs

## Technical Implementation

### Canvas Architecture

The project extends Fabric.js's core functionality through custom classes:

- Enhanced Canvas class with clipboard support
- Custom IText implementation with mobile-optimized controls
- Specialized object controls for touch devices

### State Management

Zustand is used for global state management, handling:

- Canvas object selection
- Tool selection and configuration
- Undo/redo history
- UI state management

### Mobile Optimization

- Custom touch event handling
- Responsive canvas scaling (Todo)
- Mobile-specific UI controls
- Touch gesture support (pinch-to-zoom, etc.) (Todo)

### Performance Optimizations

- Efficient canvas rendering
- Optimized event handlers
- Lazy loading of heavy components
- Debounced update operations

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT License - see LICENSE file for details
