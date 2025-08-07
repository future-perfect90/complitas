import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from 'react-router-dom';

const PublicRoute = () => {
	const { isAuthenticated } = useAuth0();
	console.log('PublicRoute', { isAuthenticated });
	// return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
	return <Outlet />; // Public routes are accessible to everyone, no authentication check needed.
};

export default PublicRoute;
