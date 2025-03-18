import React from "react";
import { createRoot } from "react-dom/client";
import {App} from "./App";
import { Provider } from "react-redux";
import Store from "./redux/store"; // Import your Redux store
import { ContextProvider } from "./contexts/ContextProvider"; // Your custom context provider
import "./index.css"
const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </Provider>
);