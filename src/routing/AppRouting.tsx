import { useRoutes, type RouteObject } from 'react-router-dom';
import About from '../pages/AboutUs';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
const AppRoutes = () => {
	const appRoutes: RouteObject[] = [
		{
			element: <PublicRoute />,
			children: [
				{ path: '/', element: <Home /> },
				{ path: '/about', element: <About /> },
			],
		},
		{
			element: <PrivateRoute />,
			children: [{ path: '/dashboard', element: <Dashboard /> }],
		},
	];
	return useRoutes(appRoutes);
};

export default AppRoutes;
