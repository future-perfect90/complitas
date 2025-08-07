import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
	const { isAuthenticated } = useAuth0();

	return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
};

export default PublicRoute;
