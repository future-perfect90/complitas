import { Navigate, Outlet } from 'react-router-dom';
const PublicRoute = () => {
	const isAuthenticated = false; // Replace with actual authentication logic

	return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
