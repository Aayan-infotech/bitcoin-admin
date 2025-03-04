import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
