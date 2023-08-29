'use client'
import {MainLayout, useWizard} from '@formswizard/forms-designer'
import {Container} from "@mui/material";

const SomeComponentUsingTheWizardState =  () => {
  const { jsonFormsEdit: { jsonSchema, uiSchema}} = useWizard()
  return <Container>
    <h5>JSON Schema:</h5>
    <code>{JSON.stringify(jsonSchema)}</code>
    <h5>UI Schema:</h5>
    <code>{JSON.stringify(uiSchema || null)}</code>
  </Container>}
const Page = () => {
  return (<>
        <MainLayout/>
        <SomeComponentUsingTheWizardState/>
      </>
  )
}

export default Page
