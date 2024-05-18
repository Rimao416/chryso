import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../src/assets/scss/app.scss";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      {/* <Provider store={myStore}> */}
        <Provider store={store}>
          <App />
        </Provider>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
      {/* </Provider> */}
    </BrowserRouter>
  </>
);
