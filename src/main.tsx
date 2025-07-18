import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NavigationProvider } from "./context/NavigationContext.tsx";
import { AlertModalProvider } from "./context/AlertModalContext.tsx";
import { ConfirmModalProvider } from "./context/ConfirmModalContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertModalProvider>
      <ConfirmModalProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </ConfirmModalProvider>
    </AlertModalProvider>
  </StrictMode>
);
