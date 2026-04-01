import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Use HashRouter for Electron
import {ThemeProvider} from "@material-tailwind/react";
import './index.css';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider value={{}}>
      <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
