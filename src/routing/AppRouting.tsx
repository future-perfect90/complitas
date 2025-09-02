import { useRoutes, type RouteObject } from 'react-router-dom';
import About from '../pages/AboutUs';
import CompanyList from '../pages/CompanyList';
import ComplianceReports from '../pages/ComplianceReports';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Property from '../pages/Property';
import PropertyList from '../pages/PropertyList';
import TeamList from '../pages/TeamList';
import UserList from '../pages/UserManagementList';
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
			children: [
				{ path: '/dashboard', element: <Dashboard /> },
				{ path: '/companies', element: <CompanyList /> },
				{ path: '/properties', element: <PropertyList /> },
				{ path: '/properties/:id', element: <Property /> },
				{
					path: '/properties/:id/compliance-reports',
					element: <ComplianceReports />,
				},
				{ path: '/users', element: <UserList /> },
				{ path: '/teams', element: <TeamList /> },
				{ path: '/profile', element: <Profile /> },
			],
		},
	];
	return useRoutes(appRoutes);
};

export default AppRoutes;
