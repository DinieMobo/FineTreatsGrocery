import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyOrders from '../pages/MyOrders';
import OrderDetails from '../pages/OrderDetails';
import AdminOrderManagement from '../pages/AdminOrderManagement';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import NoData from '../components/NoData';
import Home from '../pages/Home';
import ProductPage from '../pages/ProductPage';
import Checkout from '../pages/Checkout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/checkout" element={
        <ProtectedRoute requiredRole="Customer">
          <Checkout />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="Customer">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="myorders" replace />} />
        <Route path="myorders" element={<MyOrders />} />
        <Route path="orderdetails/:orderId" element={<OrderDetails />} />
        
        <Route path="admin-orders" element={
          <ProtectedRoute requiredRole="Admin">
            <AdminOrderManagement />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<NoData />} />
    </Routes>
  );
};

export default AppRoutes;
