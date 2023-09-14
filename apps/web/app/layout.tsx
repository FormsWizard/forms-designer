import { WizardProvider } from '@formswizard/forms-designer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </WizardProvider>
  )
}
