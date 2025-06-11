// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// مسار خاص يمرر فقط المستخدمين اللي عندهم دور الأدمن
const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/unauthorized" />; // صفحة غير مصرح بها
  }

  return children;
};

export default AdminRoute;
