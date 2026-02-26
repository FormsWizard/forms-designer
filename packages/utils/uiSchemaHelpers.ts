import { isLayout, Layout, UISchemaElement } from '@jsonforms/core'
import last from 'lodash-es/last'
import isEmpty from 'lodash-es/isEmpty'
import { isScopableUISchemaElement, UISchemaElementWithPath, LayoutWithPath } from '@formswizard/types'
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
    const layout = uischema as Layout;
    return toApply({
      ...uischema,
      elements: layout.elements.map((child) => recursivelyMapSchema(child, toApply)).filter((child): child is UISchemaElement => child !== undefined),
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
    if (isLayout(uischema)) {
      const layout = uischema as Layout;
      if (layout.elements.find((el: UISchemaElement) => isScopableUISchemaElement(el) && el.scope === scope)) {
        // insert newElement after the element with scope
        const newElements =
          position === undefined
            ? layout.elements.reduce<UISchemaElement[]>(
              (acc, el: UISchemaElement) => {
                if (isScopableUISchemaElement(el) && el.scope === scope) {
                  return [...acc, el, newSchema];
                }
                return [...acc, el];
              },
              []
            )
            : insertAtPosOrEnd(layout.elements, position, newSchema)
        return {
          ...uischema,
          elements: newElements,
        } as UISchemaElement
      }
    }
    return uischema
  })
}
export const getAllScopesInSchema = (uiSchema: UISchemaElement) => {
  let scopes: string[] = []
  recursivelyMapSchema(uiSchema, (ui: UISchemaElement) => {
    isScopableUISchemaElement(ui) && ui.scope && scopes.push(ui.scope)
    return ui
  })
  return scopes
}
export const removeUISchemaElement = (scope: string, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema)) {
      const layout = uischema as Layout;
      if (layout.elements.find((el: UISchemaElement) => isScopableUISchemaElement(el) && el.scope === scope)) {
        // remove element with scope
        const newElements = layout.elements.filter((el: UISchemaElement) => !(isScopableUISchemaElement(el) && el.scope === scope))
        return {
          ...uischema,
          elements: newElements,
        } as UISchemaElement
      }
    }
    return uischema
  })
}

export const updateScopeOfUISchemaElement = (scope: string, newScope: string, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema: UISchemaElement) => {
    let newUischema = uischema
    if(uischema.options?.scope && uischema.options.scope.startsWith(scope) ) {
      newUischema = {
        ...uischema,
        options: {
          ...uischema.options,
          scope: newScope + uischema.options.scope.slice(scope.length),
        }
      } as UISchemaElement
    }
    if (isScopableUISchemaElement(uischema)) {
      if (uischema.scope?.startsWith(scope)) {
        newUischema = {
          ...newUischema,
          scope: newScope + uischema.scope.slice(scope.length),
        } as UISchemaElement
      }
    }
    return newUischema
  })
}

export const updateUISchemaElement = (scope: string, newSchema: UISchemaElement, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema: UISchemaElement) => {
    if (isScopableUISchemaElement(uischema)) {
    if (uischema.scope === scope) {
      return newSchema
    }
    }
    return uischema
  })
}

export const pathToPathSegments: (path: string) => string[] = (path: string) => path.split('.')
export const getIndexFromPath: (path: string) => number = (path: string) => parseInt(last(path.split('.')) || '')

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

/**
 * from a given path foo.bar.baz returns baz and foo.bar
 * @param path
 */
export const splitLastPath: (path: string) => [string | undefined, string | undefined] = (path: string) => {
  const segments = pathToPathSegments(path)
  if (segments.length <= 0) return [undefined, undefined]
  const rest = segments.slice(0, segments.length - 1)
  const restPath = rest.length <= 0 ? undefined : rest.join('.')
  return [segments[segments.length - 1], restPath]
}
export const pathToScope = (path: string) => pathSegmentsToScope(pathToPathSegments(path))

export const scopeToPathSegments = (scope: string) => {
  if (!scope.startsWith('#/')) return []
  const [, ...rest] = scope.split('/properties/')
  return rest
}

/**
 * recursively add a path, that uniquely identifies a schema element, to a UISchemaElement
 */
export const extendUiSchemaWithPath = (
  uiSchema: UISchemaElement,
  pathSegments: string[] = [],
  structurePathSegments: string[] = []
): UISchemaElementWithPath | LayoutWithPath => {
  if (isLayout(uiSchema)) {
    const layout = uiSchema as Layout
    return {
      ...layout,
      elements: layout.elements.map((el, index) =>
        extendUiSchemaWithPath(
          el,
          [...pathSegments, 'elements', index.toString()],
          [...structurePathSegments, el.type, index.toString()]
        )
      ),
      path: pathSegmentsToPath(pathSegments),
      structurePath: pathSegmentsToPath(structurePathSegments),
    }
  }
  return {
    ...uiSchema,
    path: pathSegmentsToPath(pathSegments),
    structurePath: pathSegmentsToPath(structurePathSegments),
  }
}
