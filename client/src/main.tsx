import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress known RainbowKit + React 19 compatibility warning.
// RainbowKit's ConnectModal internally triggers a setState during
// Hydrate's render phase via Zustand. This is a library-level issue
// that does not affect functionality.
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Cannot update a component') &&
    typeof args[1] === 'string' &&
    args[1] === 'ConnectModal'
  ) {
    return;
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
