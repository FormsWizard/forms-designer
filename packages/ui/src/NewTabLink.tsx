import React from "react";
import { JsonForms } from "@jsonforms/react";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";

const jsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    vegetarian: {
      type: 'boolean'
    },
    birthDate: {
      type: 'string',
      format: 'date'
    }
  }
}
export const NewTabLink = ({
  children,
  href,
  ...other
}: {
  children: React.ReactNode;
  href: string;
}) => {
  const [data, setData] = React.useState<any>({});
  const handleFormChange = React.useCallback(
      ({data}: { data: any }) => setData(data),
      [setData])
  return (
    <a target="_blank" rel="noreferrer" href={href} {...other}>
      {children}
      <JsonForms
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={handleFormChange}
          schema={jsonSchema}
      />
    </a>
  );
};
