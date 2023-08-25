import './style.css'
import { createRoot } from 'react-dom/client'
import { WizardApp } from '@formswizard/forms-designer'

const container = document.getElementById('app') as HTMLElement

const root = createRoot(container)
root.render(<WizardApp />)
