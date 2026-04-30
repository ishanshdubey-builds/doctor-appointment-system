// -------------------------------------------------------------
// Main Application Wrapper Component
// Sets up routing using BrowserRouter and encapsulates the main Loogin component
// -------------------------------------------------------------

// Import the main CSS file for global app styles
// Sets up routing using BrowserRouter and encapsulates the main AppRouter component
// -------------------------------------------------------------

// Import BrowserRouter from react-router-dom to enable routing functionality
import { BrowserRouter } from 'react-router-dom';

// Import the main layout and routing component
import AppRouter from './Component/UI/AppRouter';

// Add the imported styles corresponding to the entry level app view
import "./App.css";

// The main root application component that spins up the React mapping tree
function App() {
  return (
    // Initialize standard Browser Router required for client-side navigation maps
    <BrowserRouter>
      {/* 
        The AppRouter component
        This element strictly dictates which individual components render based directly upon URL schema paths
      */}
      <AppRouter />
    </BrowserRouter>
  );
}

// Ensure Webpack can grab function for the DOM renderer
export default App;
