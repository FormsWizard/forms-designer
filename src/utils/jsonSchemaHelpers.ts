import { JsonSchema } from '@jsonforms/core'
import { current } from '@reduxjs/toolkit'
import { pathSegmentsToPath, pathToPathSegments } from './uiSchemaHelpers'

/**
 * insert or update a property into a nested schema by following the given path
 * will throw an error if the path is invalid
 * @param schema original json schema
 * @param path path to the nested schema
 * @param newKey new key for the property
 * @param newProperty the property to insert
 */
export const deeplySetNestedProperty: (
  schema: JsonSchema,
  path: string[],
  newKey: string,
  newProperty: JsonSchema
) => JsonSchema = (schema, path, newKey, newProperty) => {
  if (!schema.properties) throw new Error(`Schema has no properties`)
  if (path.length === 0) {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        [newKey]: newProperty,
      },
    } as JsonSchema
  }
  const [first, ...rest] = path
  const nestedSchema = schema.properties[first]
  if (!nestedSchema) throw new Error(`Could not find nested schema for ${first}`)
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplySetNestedProperty(nestedSchema, rest, newKey, newProperty),
    },
  } as JsonSchema
}
export const deeplyUpdateNestedSchema: (schema: JsonSchema, path: string[], newProperty: JsonSchema) => JsonSchema = (
  schema,
  path,
  newProperty
) => {
  if (path.length === 0) {
    return {
      ...schema,
      ...newProperty,
    } as JsonSchema
  }
  const [first, ...rest] = path
  const nestedSchema = schema.properties[first]
  if (!nestedSchema) throw new Error(`Could not find nested schema for ${first}`)
  if (!schema.properties) throw new Error(`Schema has no properties`)
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyUpdateNestedSchema(nestedSchema, rest, newProperty),
    },
  } as JsonSchema
}
export const deeplyRemoveNestedProperty: (schema: JsonSchema, path: string) => JsonSchema = (schema, path) => {
  if (!schema.properties) throw new Error(`Schema has no properties`)
  const pathSegments = pathToPathSegments(path)
  if (pathSegments.length === 0) {
    return schema
  }
  if (pathSegments.length === 1) {
    return {
      ...schema,
      properties: Object.fromEntries(
        Object.entries(schema.properties).filter(
          // @ts-ignore
          ([key]) => key !== pathSegments[0]
        )
      ) as JsonSchema['properties'],
    } as JsonSchema
  }
  const [first, ...rest] = pathSegments
  const nestedSchema = schema.properties[first]
  if (!nestedSchema) throw new Error(`Could not find nested schema for ${first}`)
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyRemoveNestedProperty(nestedSchema, pathSegmentsToPath(rest)),
    },
  } as JsonSchema
}
export const deeplyRenameNestedProperty: (schema: JsonSchema, path: string[], newField: string) => JsonSchema = (
  schema,
  path,
  newField
) => {
  if (!schema.properties) throw new Error(`Schema has no properties`)
  if (path.length === 0) {
    return schema
  }
  if (path.length === 1) {
    const value = schema.properties[path[0]]
    return {
      ...schema,
      properties: {
        ...(Object.fromEntries(
          Object.entries(schema.properties).filter(
            // @ts-ignore
            ([key]) => key !== path[0]
          )
        ) as JsonSchema['properties']),
        [newField]: value,
      },
    } as JsonSchema
  }
  const [first, ...rest] = path
  const nestedSchema = schema.properties[first]
  if (!nestedSchema) throw new Error(`Could not find nested schema for ${first}`)
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyRenameNestedProperty(nestedSchema, rest, newField),
    },
  } as JsonSchema
}
