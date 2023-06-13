import { Route, Routes as BaseRoutes } from 'react-router-dom'
import Home from './features/home/Home'
import Templates from './features/Templates/Templates'
import Wizard from './features/wizard/Wizard'

export default function Routes() {
  return (
    <BaseRoutes>
      <Route path="/" element={<Wizard />}></Route>
      <Route path="/templates" element={<Templates />}></Route>
      <Route path="/home" element={<Home />}></Route>
    </BaseRoutes>
  )
}
