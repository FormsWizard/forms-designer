'use client'

import {reduxWrapper, useAppDispatch, useAppSelector} from "./reduxHooks";
import Wizard from "@formswizard/forms-designer/wizard/Wizard";
import React from "react";
import {Box} from "@mui/material";

export default function WizardWrapper() {

  const dispatch = useAppDispatch()
  return (
      <>
        <Box>
          <Wizard dispatch={dispatch} useSelector={useAppSelector} />
        </Box>
      </>
  );
}
