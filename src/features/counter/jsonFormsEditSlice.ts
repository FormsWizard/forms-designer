import {createSlice} from "@reduxjs/toolkit";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {RootState} from "../../app/store";

export type JsonFormsEditState = {
  jsonSchema: JsonSchema,
  uiSchema?: UISchemaElement
}

const initialState: JsonFormsEditState = {
  jsonSchema: {
    "type":"object",
    "properties":{
      "name":{
        "type":"string"
      },
      "description":{
        "type":"string"
      },
      "done":{
        "type":"boolean"
      },
      "rating":{
        "type":"integer"
      }
    },
    "required":[
      "name"
    ]
  },
  uiSchema: undefined
}

export const selectJsonSchema = (state: RootState) => state.jsonFormsEdit.jsonSchema

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState,
  reducers: {}
})

export default jsonFormsEditSlice.reducer
