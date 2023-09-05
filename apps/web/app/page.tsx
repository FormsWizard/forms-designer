'use client'
import { useWizard } from '@formswizard/forms-designer'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { WizardMainLayout } from './WizardMainLayout'

const SomeComponentUsingTheWizardState = () => {
  const { jsonSchema, uiSchema, getState } = useWizard()
  useEffect(() => {
    console.log(getState())
  }, [getState])

  return (
    <Container>
      <h5>JSON Schema:</h5>
      <code>{JSON.stringify(jsonSchema)}</code>
      <h5>UI Schema:</h5>
      <code>{JSON.stringify(uiSchema || null)}</code>
    </Container>
  )
}
const Page = () => {
  //const WizardMainLayout = dynamic(() => import('./WizardMainLayoutNoSSR').then((mod) => mod.WizardMainLayout), { ssr: false })

  return (
    <>
      <WizardMainLayout />
      <SomeComponentUsingTheWizardState />
    </>
  )
}

export default Page
