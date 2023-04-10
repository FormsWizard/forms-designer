import React from "react";
import logo from "./logo.svg";

import { Counter } from "../counter/Counter";
import LeftDrawer from "./LeftDrawer";
import RightDrawer from "./RightDrawer";
import MainAppBar from "./AppBar";
import MainContent from "./MainContent";
import { Box } from "@mui/system";

function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <MainAppBar></MainAppBar>
      <LeftDrawer></LeftDrawer>
      <MainContent></MainContent>
      <RightDrawer></RightDrawer>
    </Box>
  );
}

export default App;
