import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthMeta } from '../context/AuthProvider';

interface RoleBasedRouteProps {
	allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
	const authMeta = useAuthMeta();

	if (authMeta?.isLoading) {
		return <div>Loading user permissions...</div>;
	}

	const userRoles = authMeta?.roles || [];
	const isAllowed = userRoles.some((role) => allowedRoles.includes(role));

	if (!isAllowed) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};

export default RoleBasedRoute;
