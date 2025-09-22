
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx loading...");

// Mobile-specific initialization handling
const initializeApp = () => {
  console.log("Initializing app...");
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }
  
  try {
    console.log("Creating React root...");
    const root = createRoot(rootElement);
    
    console.log("Rendering App component...");
    root.render(<App />);
    
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Error during app initialization:", error);
    
    // Fallback for mobile browsers - try again after a short delay
    setTimeout(() => {
      console.log("Retrying app initialization...");
      try {
        const root = createRoot(rootElement);
        root.render(<App />);
        console.log("App successfully rendered on retry");
      } catch (retryError) {
        console.error("Retry failed:", retryError);
      }
    }, 500);
  }
};

// Check if document is ready
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded...");
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  console.log("Document already loaded, initializing immediately");
  initializeApp();
}
