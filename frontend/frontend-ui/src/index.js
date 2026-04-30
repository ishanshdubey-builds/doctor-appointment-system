// -------------------------------------------------------------
// Entry point of the React application
// This file initializes the React app and renders the main App component
// -------------------------------------------------------------

// Import the React library, necessary for using JSX and React features
import React from 'react';

// Import createRoot from react-dom/client to render the app using React 18 API
import { createRoot } from 'react-dom/client';

// Import global CSS styles (updated for professional look)
import './index.css';

// Import the root App component which contains the routing and main structure
import App from './App';

// Import reportWebVitals for performance measuring (currently unused but kept for future metrics)
import reportWebVitals from './reportWebVitals';

// Find the HTML element with id 'root' where our React app will be injected
const rootElement = document.getElementById('root');

// Create a React root for rendering the component tree
const root = createRoot(rootElement);

// Render the App component wrapped inside React.StrictMode
// StrictMode enables additional checks and warnings in development mode
root.render(
  <React.StrictMode>
    {/* Render the core application component */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();