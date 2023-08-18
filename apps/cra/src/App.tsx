import React from "react";
import "./App.css";
import { NewTabLink  } from "@formswizard/ui";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="header">
          Web
          <div className="Turborepo">Turborepo Example</div>
        </h1>
        <div>
          <NewTabLink href="https://turbo.build/repo">Turborepo</NewTabLink> +{" "}
          <NewTabLink href="https://vitejs.dev/">Vite</NewTabLink>
        </div>
      </header>
    </div>
  );
}

export default App;
