import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.log('[Global Error]', { msg, url, lineNo, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.log('[Unhandled Rejection]', event.reason);
};

console.log('[Bootstrap] Starting index.tsx');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
