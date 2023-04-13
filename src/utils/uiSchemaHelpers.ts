import {isLayout, Scopable, UISchemaElement} from "@jsonforms/core";
import isEmpty from "lodash/isEmpty";

/**
 * recursivly apply a function to a UISchemaElement and its children in case of a layout
 *
 * @param uischema
 * @param toApply
 */
export const recursivelyMapSchema = (
    uischema: UISchemaElement,
    toApply: (uischema: UISchemaElement) => (UISchemaElement | undefined)
): UISchemaElement | undefined => {
  if (isEmpty(uischema)) {
    return undefined;
  }
  if (isLayout(uischema)) {
    return toApply({
      ...uischema,
      elements: uischema.elements.map(child => recursivelyMapSchema(child, toApply))
    } as UISchemaElement)
  }
  return toApply(uischema);
};
type ScopableUISchemaElement = UISchemaElement & Scopable
export const insertUISchemaAfterScope = (scope: string, newSchema: UISchemaElement, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema) && uischema.elements.find((el: ScopableUISchemaElement) => el.scope === scope)) {
      // insert newElement after the element with scope
      const newElements = uischema.elements.reduce<ScopableUISchemaElement[]>(
          (acc, el: ScopableUISchemaElement) => (el.scope === scope) ? [...acc, el, newSchema] : [...acc, el], [])
      return {
        ...uischema,
        elements: newElements
      } as UISchemaElement
    }
    return uischema
  })
}
