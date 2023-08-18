import "./style.css";
import typescriptLogo from "./typescript.svg";
import { WizardApp } from "@formswizard/forms-designer";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <div class="card">
      ${WizardApp()}
    </div>
  </div>
`;

