import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./assets/sass/main.scss";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MoralisProvider
      appId="HkUKtRTR6HeP31SHK19w6WCVSFJKHu9EKY2gSD68"
      serverUrl="https://prihmlgizzfz.usemoralis.com:2053/server"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
