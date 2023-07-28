import React, {FunctionComponent} from 'react';
import {Container, Drawer, Paper, Toolbar} from "@mui/material";
import {Wizard} from "./Wizard";
import {Toolbox} from "toolbox";
import { useDrag } from 'react-dnd'

interface OwnProps {
}

type Props = OwnProps;

const drawerWidth = 240
const MainLayout: FunctionComponent<Props> = (props) => {

  return (<>
    <Drawer
        variant="persistent"
        anchor="left"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
    >
      <Toolbar/>
      <Toolbox />
    </Drawer>
    <Container maxWidth="md">
      <Paper sx={{p: 4, m: 4}} elevation={12} square>
        <Wizard/>
      </Paper>
    </Container>

  </>);
};

export default MainLayout;
