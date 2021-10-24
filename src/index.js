import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <div style={{
      position: 'absolute', 
      height: '640px', width: '360px', 
      left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)', boxShadow: '5px 10px 18px #888888'
      }} >
        <App />
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);