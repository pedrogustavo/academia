import React from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './pages/Login';
import Users from './pages/Users';
import Students from './pages/Students';
import Payments from './pages/Payments';
import UserForm from './pages/Users/Form';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserForm />} />
        <Route path="students" element={<Students />} />
        <Route path="payments" element={<Payments />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
