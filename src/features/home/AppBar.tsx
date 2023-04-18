import * as React from 'react'
import AppBar from '@mui/material/AppBar'

import Toolbar from '@mui/material/Toolbar'

import Typography from '@mui/material/Typography'
import {Switch} from "@mui/material";
import {selectEditMode, toggleEditMode} from "../wizard/WizardSlice";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../app/hooks/reduxHooks";

function MainAppBar() {
  const dispatch = useAppDispatch()
  const editMode = useSelector(selectEditMode)
  const handleToggleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleEditMode())
  };
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Edit Mode
        </Typography>
        <Switch checked={editMode} onChange={handleToggleEdit}/>
      </Toolbar>
    </AppBar>
  )
}

export default MainAppBar
