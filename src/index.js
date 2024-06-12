import React from "react";
//import { createRoot } from "react-dom/client";
import "normalize.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./index.css";

import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";  // Import from react-dom/client

const container = document.getElementById("root");

// Create a root.
const root = ReactDOM.createRoot(container);

// Initial render
root.render(
  <Provider store={store}>
    <App tab="home" />
  </Provider>
);
