import {Box, Button, TextField} from "@mui/material";
import { Header } from "ui";
import WizardWrapper from "./WizardWrapper";
import {reduxWrapper} from "./reduxHooks";
 export default function Page() {

  return (
    <>
      <Header text="Web" />
        <WizardWrapper />
    </>
  );
}
