import React from "react";

import RightDrawer from "./RightDrawer";
import MainAppBar from "./AppBar";
import MainContent from "./MainContent";
import { Box } from "@mui/system";

function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <MainAppBar></MainAppBar>
      <RightDrawer></RightDrawer>
      <MainContent></MainContent>
    </Box>
  );
}

export default App;
