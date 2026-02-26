---
to: packages/<%= name.split("/")[1] %>/README.md
---
# <%= name %>

<%= description %>

## Installation

```bash
npm install <%= name %>
```

## Usage

```typescript
import { <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection } from '<%= name %>'

// Use the tool collection in your forms designer
const { draggableComponents, icons, renderers } = <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection
```

## Components

This package includes:

- **Draggable Components**: Form components that can be dragged into the designer
- **Icons**: Icon components for the toolbox
- **Renderers**: JsonForms renderers for displaying the components
- **Tool Settings**: Configuration options for each component

## License

MIT
