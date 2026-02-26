import React from 'react'
import type { Preview } from '@storybook/react'
import { I18nProvider } from '@formswizard/i18n'

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(I18nProvider, null, React.createElement(Story)),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
