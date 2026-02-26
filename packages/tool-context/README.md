# @formswizard/tool-context

A React Context Provider for managing tool libraries and their registries in the Forms Designer.

## Features

- **Icon Registry**: Register and manage custom icons
- **Renderer Registry**: Register custom JSON Forms renderers
- **Cell Renderer Registry**: Register custom cell renderers
- **AJV Format Registry**: Register custom AJV format validators
- **Tool Settings**: Register custom tool settings
- **Draggable Elements**: Register draggable form elements

## Usage

### Basic Setup

```tsx
import { ToolProvider } from '@formswizard/tool-context'
import { basicComponentIcons } from '@formswizard/toolbox'

const MyApp = () => {
  const basicToolCollection = {
    info: {
      name: 'Basic Components',
      description: 'Basic form components',
      categories: ['basic']
    },
    iconRegistry: basicComponentIcons,
    // ... other registries
  }

  return (
    <ToolProvider toolCollections={[basicToolCollection]}>
      <YourFormsDesigner />
    </ToolProvider>
  )
}
```

### Using Hooks

```tsx
import { 
  useIconRegistry, 
  useDraggableElements 
} from '@formswizard/tool-context'

const MyComponent = () => {
  const iconRegistry = useIconRegistry()
  const draggableElements = useDraggableElements()

  // Access icons
  const LabelIcon = iconRegistry.Label

  return (
    <div>
      {/* Your component content */}
    </div>
  )
}
```

### Graceful Degradation

The context works even without a `ToolProvider` - it will warn in the console but continue to function with empty registries.

```tsx
// This will work but show warnings
const MyComponent = () => {
  const { isProviderPresent } = useToolContext()
  
  if (!isProviderPresent) {
    console.log('No ToolProvider found - using empty registries')
  }
  
  // Component still works with empty registries
}
```

## API Reference

### Components

- `ToolProvider`: Context provider component that accepts `toolCollections` prop
- `useToolContext`: Main hook to access the context

### Hooks

- `useIconRegistry()`: Get the icon registry
- `useRendererRegistry()`: Get the renderer registry  
- `useCellRendererRegistry()`: Get the cell renderer registry
- `useAjvFormatRegistry()`: Get the AJV format registry
- `useToolSettings()`: Get tool settings
- `useDraggableElements()`: Get draggable elements
- `useRegisteredCollections()`: Get list of registered collection names
- `useIsToolProviderPresent()`: Check if provider is present

### Utility Hooks

- `useIcon(name)`: Get a specific icon by name
- `useAllIcons()`: Get all registered icons
- `useDraggableElementsByCategory(category)`: Filter draggable elements by category
- `useToolSettingsByTester(tester)`: Filter tool settings by tester
