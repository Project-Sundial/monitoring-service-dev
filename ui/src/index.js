import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';

import '@fontsource/roboto/700.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
