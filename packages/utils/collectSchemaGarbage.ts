import { JsonSchema, JsonSchema7, resolveSchema, UISchemaElement } from '@jsonforms/core'
import { cloneDeep } from 'lodash'
import { getAllScopesInSchema } from './uiSchemaHelpers'

export function collectSchemaGarbage(jsonschema: JsonSchema, uiSchema: UISchemaElement) {
  const scopes = getAllScopesInSchema(uiSchema)
  const marked = cloneDeep(jsonschema)
  traverseObjects(marked, (obj) => {
    if (obj.type && !obj.properties) {
      obj.toBeDeleted = true
    }
  })

  for (let scope of scopes) {
    let resolved = resolveSchema(marked, scope, marked) as (JsonSchema7 & { toBeDeleted?: boolean }) | undefined
    if (resolved?.toBeDeleted) delete resolved.toBeDeleted
  }
  traverseDelete(marked)
  return marked
}

const traverseObjects = (obj: Record<string, any>, cb: (element: any) => void): void => {
  for (let k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      cb(obj[k])

      traverseObjects(obj[k], cb)
    }
  }
}
const traverseDelete = (obj: Record<string, any>): void => {
  for (let k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      traverseDelete(obj[k])
      if (obj[k].toBeDeleted) {
        delete obj[k]
      } else if (obj[k].properties && Object.keys(obj[k].properties).length === 0) {
        delete obj[k]
      }
    }
  }
}
