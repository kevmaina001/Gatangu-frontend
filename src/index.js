import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot API
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Create the root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
