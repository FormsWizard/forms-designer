'use client'

import React from "react";
import {MainLayout} from "./MainLayout";
import {WizardProvider} from "./WizardProvider";

export function WizardApp() {
  return <WizardProvider>
    <MainLayout/>
  </WizardProvider>
}
