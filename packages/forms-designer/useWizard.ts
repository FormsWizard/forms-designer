import { RootState, useAppSelector } from '@formswizard/state'
import { JsonSchema, UISchemaElement } from '@jsonforms/core'
import { useStore } from 'react-redux'

export const useWizard = (): { getState: () => RootState; jsonSchema: JsonSchema; uiSchema: UISchemaElement } => {
  const store = useStore()

  const jsonSchema = useAppSelector((state) => state.jsonFormsEdit.jsonSchema)
  const uiSchema = useAppSelector((state) => state.jsonFormsEdit.uiSchema)

  const getState = () => {
    return store.getState() as RootState
  }

  return { getState, jsonSchema, uiSchema }
}
