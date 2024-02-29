import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './components/Context/Context';
import Modal from 'react-modal';
const root = ReactDOM.createRoot(document.getElementById('root'));


Modal.setAppElement('#root');
root.render(
<React.StrictMode>
  <BrowserRouter>
  <AppProvider>
  <App />
  </AppProvider>
  </BrowserRouter>
</React.StrictMode>
);

reportWebVitals();
