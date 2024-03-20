import React from 'react';
import { createBrowserRouter,  Navigate } from 'react-router-dom';
import RootLayout from '../Pages/MainLayout/RootLayout';
import Dashboard from '../Pages/Dashboard';
import BrandList from '../Pages/Brand/BrandList';



export const router = createBrowserRouter([
  
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/brand", element: <BrandList /> },
    ],
  },
]);