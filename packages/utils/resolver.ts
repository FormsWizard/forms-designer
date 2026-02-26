import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";

import { decode } from "./jsonPointer";
import { JsonSchema } from "@formswizard/types";

const invalidSegment = (pathSegment: string) =>
  pathSegment === "#" || pathSegment === undefined || pathSegment === "";

/**
 * Resolve the given scope without resolving the $ref
 * 
 * @param rootSchema the root schema from which to start
 * @param scope the scope to resolve
 * @returns the resolved scope schema -> might be { $ref: "..."}
 */
export const resolveScopeWithoutRef = (rootSchema: JsonSchema, scope: string) => resolveSchema(rootSchema, scope, rootSchema, true)

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @param {boolean} doNotResolveRef if true, the $ref will not be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (
  schema: JsonSchema,
  schemaPath: string | undefined,
  rootSchema: JsonSchema,
  doNotResolveRef?: boolean,
): JsonSchema | undefined => {
  const segments = (schemaPath?.split("/") || []).map(decode);
  return resolveSchemaWithSegments(schema, segments, rootSchema, doNotResolveRef);
};

const resolveSchemaWithSegments = (
  schema_: JsonSchema,
  pathSegments: string[],
  rootSchema: JsonSchema,
  doNotResolveRef?: boolean,
): JsonSchema | undefined => {
  if (isEmpty(schema_)) {
    return undefined;
  }

  let schema: JsonSchema | undefined = schema_;

  if (schema.$ref && !doNotResolveRef) {
    schema = resolveSchema(rootSchema, schema.$ref, rootSchema, doNotResolveRef);
  }

  if (!pathSegments || pathSegments.length === 0) {
    return schema;
  }

  const [segment, ...remainingSegments] = pathSegments;

  if (invalidSegment(segment) && schema) {
    return resolveSchemaWithSegments(schema, remainingSegments, rootSchema, doNotResolveRef);
  }

  const singleSegmentResolveSchema = get(schema, segment);

  const resolvedSchema = resolveSchemaWithSegments(
    singleSegmentResolveSchema,
    remainingSegments,
    rootSchema,
    doNotResolveRef,
  );
  if (resolvedSchema) {
    return resolvedSchema;
  }

  if (segment === "properties" || segment === "items") {
    // Let's try to resolve the path, assuming oneOf/allOf/anyOf/then/else was omitted.
    // We only do this when traversing an object or array as we want to avoid
    // following a property which is named oneOf, allOf, anyOf, then or else.
    let alternativeResolveResult = undefined;

    if (!schema) return undefined;

    const subSchemas = [].concat(
      // @ts-ignore
      schema.oneOf ?? [],
      schema.allOf ?? [],
      schema.anyOf ?? [],
      (schema as any).then ?? [],
      (schema as any).else ?? [],
    );

    for (const subSchema of subSchemas) {
      // @ts-ignore
      alternativeResolveResult = resolveSchemaWithSegments(
        subSchema,
        [segment, ...remainingSegments],
        rootSchema,
        doNotResolveRef,
      );
      if (alternativeResolveResult) {
        break;
      }
    }
    return alternativeResolveResult;
  }

  return undefined;
};
