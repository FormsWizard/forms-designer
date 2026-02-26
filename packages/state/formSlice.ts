import { createSlice, PayloadAction, type Reducer } from "@reduxjs/toolkit";

export interface FormDataState {
  formData: { [propertyPath: string]: any };
}

const initialState: FormDataState = {
  formData: {},
};

export interface SetFormDataPayload {
  formData: { [propertyPath: string]: any };
  cause?: string;
}

const formSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    // Action to initialize form data by creating a new entity with a generated iri and returning the new entityIRI
    initializeFormData: (
      state,
      action: PayloadAction<{ newEntityIRI: () => string; typeIRI: string }>,
    ) => {
      state.formData = {
        "@id": action.payload.newEntityIRI(),
        "@type": action.payload.typeIRI,
      };
    },
    // Action to set form data with an optional cause
    setFormData: (state, action: PayloadAction<SetFormDataPayload>) => {
      state.formData = action.payload.formData;
    },
    // Action to update form data with an updater function and optional cause
    updateFormData: (
      state,
      action: PayloadAction<{
        propertyPath: string;
        updater: (formData: any) => any | any;
        cause?: string;
      }>,
    ) => {
      const { propertyPath, updater, cause } = action.payload;
      state.formData[propertyPath] =
        typeof updater === "function"
          ? updater(state.formData[propertyPath])
          : updater;
    },
  },
});

export const { setFormData, updateFormData, initializeFormData } =
  formSlice.actions;

export const formDataReducer: Reducer<FormDataState> = formSlice.reducer;
