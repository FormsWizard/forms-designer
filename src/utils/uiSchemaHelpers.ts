import { isLayout, UISchemaElement } from '@jsonforms/core'
import isEmpty from 'lodash/isEmpty'
import { ScopableUISchemaElement } from '../types'

/**
 * recursivly apply a function to a UISchemaElement and its children in case of a layout
 *
 * @param uischema
 * @param toApply
 */
export const recursivelyMapSchema = (
  uischema: UISchemaElement,
  toApply: (uischema: UISchemaElement) => UISchemaElement | undefined
): UISchemaElement | undefined => {
  if (isEmpty(uischema)) {
    return undefined
  }
  if (isLayout(uischema)) {
    return toApply({
      ...uischema,
      elements: uischema.elements.map((child) => recursivelyMapSchema(child, toApply)),
    } as UISchemaElement)
  }
  return toApply(uischema)
}
export const insertUISchemaAfterScope = (scope: string, newSchema: UISchemaElement, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema) && uischema.elements.find((el: ScopableUISchemaElement) => el.scope === scope)) {
      // insert newElement after the element with scope
      const newElements = uischema.elements.reduce<ScopableUISchemaElement[]>(
        (acc, el: ScopableUISchemaElement) => (el.scope === scope ? [...acc, el, newSchema] : [...acc, el]),
        []
      )
      return {
        ...uischema,
        elements: newElements,
      } as UISchemaElement
    }
    return uischema
  })
}
export const removeUISchemaElement = (scope: string, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema) && uischema.elements.find((el: ScopableUISchemaElement) => el.scope === scope)) {
      // insert newElement after the element with scope
      const newElements = uischema.elements.filter((el: ScopableUISchemaElement) => el.scope !== scope)
      return {
        ...uischema,
        elements: newElements,
      } as UISchemaElement
    }
    return uischema
  })
}

export const updateScopeOfUISchemaElement = (scope: string, newScope: string, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema: ScopableUISchemaElement) => {
    if (uischema.scope === scope) {
      return {
        ...uischema,
        scope: newScope,
      } as UISchemaElement
    }
    return uischema
  })
}

export const updateUISchemaElement = (scope: string, newSchema: UISchemaElement, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema: ScopableUISchemaElement) => {
    if (uischema.scope === scope) {
      return newSchema
    }
    return uischema
  })
}

export const pathToScope = (path: string[]) => {
  return `#/properties/${path.join('/properties/')}`
}
