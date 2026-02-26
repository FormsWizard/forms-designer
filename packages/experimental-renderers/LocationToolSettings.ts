import { ToolSetting, JsonSchema } from '@formswizard/types'
import { resolveSchema } from '@formswizard/utils';


/**
 *  recursively go through the schema (stop at anything that has an '@id' property or if we are within a endless recursion (Person -> knows -> Person,...))
 * @param rootSchema the root schema to start from
 * 
 * @returns an array of {title: string, const: string} where title is the title of the field (address -> street) and const is the path to the field (#/properties/address/properties/street)
 */
const getAvailableStringFields: (rootSchema: JsonSchema) => {
    title: string;
    const: string;
}[] = (rootSchema: JsonSchema) => {
  const result: Array<{ title: string; const: string }> = [{
    title: 'none',
    const: 'none'
  }]
  const visited = new Set<string>()

  const traverseSchema = (
    schema: JsonSchema | undefined,
    path: string[] = [],
    titlePath: string[] = [],
    level: number = 0
  ) => {
    if (!schema) return

    // Create a unique key for this schema to prevent infinite recursion
    const schemaKey = `${path.join('/')}_${JSON.stringify(schema)}`
    if (visited.has(schemaKey)) {
      return
    }
    visited.add(schemaKey)

    // Resolve $ref if present
    let resolvedSchema: JsonSchema | undefined = schema
    if (schema.$ref) {
      resolvedSchema = resolveSchema(rootSchema, schema.$ref, rootSchema) as (JsonSchema | undefined)
    }
    if (!resolvedSchema) return

    // Stop if this schema has an '@id' property (indicates a linked object)
    if (resolvedSchema.properties?.['@id'] && level > 0) {
      return
    }

    // Check if current schema is a string type
    if (resolvedSchema.type === 'string' ) {
      const pathString = path.length > 0 ? `#/properties/${path.join('/properties/')}` : '#'
      const titleString = titlePath.length > 0 ? titlePath.join(' → ') : 'Root'
      result.push({
        title: titleString,
        const: pathString
      })
      return
    }

    // Recursively traverse object properties
    if (resolvedSchema.type === 'object' && resolvedSchema.properties) {
      Object.keys(resolvedSchema.properties).forEach(key => {
        if(key.startsWith('@')) return
        const property = resolvedSchema?.properties?.[key]
        if (typeof property === 'object' && property !== null && typeof property !== 'boolean') {
          const propertyTitle = (property as any).title || key
          traverseSchema(
            property as JsonSchema,
            [...path, key],
            [...titlePath, propertyTitle],
            level + 1
          )
        }
      })
    }

    // Handle array items
    if (resolvedSchema.type === 'array' || resolvedSchema.items) {
      return
    }
  }

  traverseSchema(rootSchema)

  return result
}

const jsonSchema = (rootSchema: JsonSchema) => ({
  type: 'object',
  properties: {
    mapNominatimFields: {
      type: 'boolean',
    },
    showConfirmationDialog: {
      type: 'boolean',
    },
    nominatimFieldMappings: {
      type: 'object',
      properties: Object.fromEntries([
        "name",
        "display_name",
        "office",
        "road",
        "neighbourhood",
        "residential",
        "house_number",
        "suburb",
        "city_district",
        "city",
        "state",
        "ISO3166-2-lvl4",
        "postcode",
        "country",
        "country_code"
      ].map(field => [field, { type: 'string', oneOf: getAvailableStringFields(rootSchema) }]))
    }
  },
})

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {
    nominatimFieldMappings: uiSchema?.options?.nominatimFieldMappings,
    mapNominatimFields: uiSchema?.options?.mapNominatimFields,
    showConfirmationDialog: uiSchema?.options?.showConfirmationDialog,
  }
}

// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
    ...(toolData?.mapNominatimFields
      ? {
          options: {
            mapNominatimFields: toolData?.mapNominatimFields,
            nominatimFieldMappings: toolData?.nominatimFieldMappings,
            showConfirmationDialog: toolData?.showConfirmationDialog,
          },
        }
      : {}),
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  return {
    ...wizardSchema,
  }
}

export const LocationToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,

  jsonSchema,
  tester: (uiSchema, jsonSchema) => (jsonSchema?.type === 'string' && jsonSchema?.format === 'wktLiteral' ? 10 : 0),

  toolSettingsMixins: [],
}
