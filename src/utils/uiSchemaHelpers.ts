import { isLayout, Layout, UISchemaElement } from '@jsonforms/core'
import isEmpty from 'lodash/isEmpty'
import { ScopableUISchemaElement } from '../types'

const insertIntoArray = <T>(arr: T[], index: number, element: T) => {
  return [...arr.slice(0, index), element, ...arr.slice(index)]
}
const insertAtPosOrEnd = <T>(arr: T[], index: number, element: T) => {
  return arr.length <= index ? [...arr, element] : insertIntoArray(arr, index, element)
}
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
export const insertUISchemaAfterScope = (
  scope: string,
  newSchema: UISchemaElement,
  uiSchema: UISchemaElement,
  position?: number
) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema) && uischema.elements.find((el: ScopableUISchemaElement) => el.scope === scope)) {
      // insert newElement after the element with scope
      const newElements =
        position === undefined
          ? uischema.elements.reduce<ScopableUISchemaElement[]>(
              (acc, el: ScopableUISchemaElement) => (el.scope === scope ? [...acc, el, newSchema] : [...acc, el]),
              []
            )
          : insertAtPosOrEnd(uischema.elements, position, newSchema)
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
    if (uischema.scope?.startsWith(scope)) {
      return {
        ...uischema,
        scope: newScope + uischema.scope.slice(scope.length),
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

export const pathToPathSegments: (path: string) => string[] = (path: string) => path.split('.')

export const pathSegmentsToScope = (path: string[]) => {
  return `#/properties/${path.join('/properties/')}`
}

export const pathSegmentsToJSONPointer = (pathSegments: string[]) => {
  pathSegments.forEach((segment) => {
    if (segment.includes('/')) {
      throw new Error('path segments must not contain slashes')
    }
  })
  return `/${pathSegments.join('/')}`
}

/**
 * converts an array of strings to a json pointer
 * @throws  Error is segments contain a '.'
 * @param pathSegments
 */
export const pathSegmentsToPath = (pathSegments: string[]) => {
  pathSegments.forEach((segment) => {
    if (segment.includes('.')) {
      throw new Error('path segments must not contain dots')
    }
  })
  return pathSegments.join('.')
}

export const pathToScope = (path: string) => pathSegmentsToScope(pathToPathSegments(path))

export const scopeToPathSegments = (scope: string) => {
  if (!scope.startsWith('#/')) return []
  const [, ...rest] = scope.split('/properties/')
  return rest
}

type UISchemaElementWithPath = UISchemaElement & { path: string }
type LayoutWithPath = Layout & { path: string }

/**
 * recursively add a path, that uniquely identifies a schema element, to a UISchemaElement
 */
export const extendUiSchemaWithPath = (
  uiSchema: UISchemaElement,
  pathSegments: string[] = []
): UISchemaElementWithPath | LayoutWithPath => {
  if (isLayout(uiSchema)) {
    const layout = uiSchema as Layout
    return {
      ...layout,
      elements: layout.elements.map((el, index) =>
        extendUiSchemaWithPath(el, [...pathSegments, 'elements', index.toString()])
      ),
      path: pathSegmentsToPath(pathSegments),
    }
  }
  return {
    ...uiSchema,
    path: pathSegmentsToPath(pathSegments),
  }
}
