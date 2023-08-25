import type { Meta, StoryObj } from '@storybook/react'
import { WizardApp } from './WizardApp'

const meta = {
  title: 'example/WizardApp',
  component: WizardApp,
} satisfies Meta<typeof WizardApp>
export default meta

export const Story: StoryObj<typeof meta> = {}
