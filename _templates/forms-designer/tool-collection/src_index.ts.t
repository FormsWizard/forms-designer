---
to: packages/<%= name.split("/")[1] %>/src/index.ts
---
// Export draggable components
export * from './draggableComponents'

// Export icons
export * from './icons'

// Export renderers
export * from './renderers'

// Export tool settings if applicable
export * from './toolSettings'

// Export the complete tool collection
export * from './toolCollection'
