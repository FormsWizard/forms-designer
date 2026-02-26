---
to: packages/<%= name.split("/")[1] %>/tsup.config.js
---
import { makeConfigWithExternals } from "@formswizard/tsup-config/tsup.config.js";
import pkg from "./package.json";

const config = makeConfigWithExternals(pkg);
export default config;
