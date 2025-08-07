import { Navigate, Outlet } from 'react-router-dom';
const PrivateRoute = () => {
	const isAuthenticated = true; // Replace with actual authentication logic

	return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PrivateRoute;
