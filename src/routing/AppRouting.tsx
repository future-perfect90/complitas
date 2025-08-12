import { useRoutes, type RouteObject } from 'react-router-dom';
import About from '../pages/AboutUs';
import CompanyList from '../pages/CompanyList';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
const AppRoutes = () => {
	const appRoutes: RouteObject[] = [
		{
			element: <PublicRoute />,
			children: [
				{ path: '/', element: <Home /> },
				{ path: '/about', element: <About /> },
				{ path: '/login', element: <Login /> },
				{ path: '/companyList', element: <CompanyList /> },
			],
		},
		{
			element: <PrivateRoute />,
			children: [
				{ path: '/dashboard', element: <Dashboard /> },
				{ path: '/logout', element: <Logout /> },
			],
		},
	];
	return useRoutes(appRoutes);
};

export default AppRoutes;
