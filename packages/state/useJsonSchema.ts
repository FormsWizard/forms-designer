import { useAppSelector } from "./hooks"
import { selectJsonSchema, selectJsonSchemaDefinitions, selectRootJsonSchema } from "./wizard/jsonFormsEditSlice"
import { useMemo } from "react"

export const useJsonSchema = () => {
  const jsonSchema = useAppSelector(selectRootJsonSchema)
  return useMemo(() => jsonSchema, [jsonSchema])
}
