import React from 'react';
import { createBrowserRouter,  Navigate } from 'react-router-dom';
import RootLayout from '../Pages/MainLayout/RootLayout';
import Dashboard from '../Pages/Dashboard';



export const router = createBrowserRouter([
  
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);