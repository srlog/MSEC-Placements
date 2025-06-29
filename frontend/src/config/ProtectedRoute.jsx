import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ role }) => {
  const user = getCurrentUser();
  const token = localStorage.getItem('token');

  if (!token || !user.id) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;