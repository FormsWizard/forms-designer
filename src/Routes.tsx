import { Route, Routes as BaseRoutes } from "react-router-dom";
import Home from "./features/home/Home";
import Wizard from "./features/wizard/Wizard";

export default function Routes() {
  return (
    <BaseRoutes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/wizard" element={<Wizard />}>
      </Route>
    </BaseRoutes>
  );
}