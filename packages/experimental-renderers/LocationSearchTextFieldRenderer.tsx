import React from 'react';
import {
  and,
  ControlProps, formatIs,
  isStringControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {MaterialInputControl, MuiInputText} from "@jsonforms/material-renderers";
import {LocationSearchField} from "./LocationSearchField";

export const WktLiteralInputControl = (props: ControlProps) => (<>
    <MaterialInputControl {...props} input={MuiInputText} />
      <LocationSearchField onLocationFound={(lat, lng) => {
        console.log(lat, lng);
        props.handleChange(props.path, `POINT(${lng} ${lat})`);
      }} />
    </>
);

export const WktLiteralTextControlTester: RankedTester = (rankWith(
    10,
    and(isStringControl,formatIs('wktLiteral'))));
export const WktLiteralTextControlRenderer = withJsonFormsControlProps(WktLiteralInputControl);
