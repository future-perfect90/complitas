import { useRoutes, type RouteObject } from 'react-router-dom';
import About from '../pages/AboutUs';
import CompanyList from '../pages/CompanyList';
import ComplianceOverview from '../pages/ComplianceOverview';
import ComplianceReports from '../pages/ComplianceReports';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import PDFReport from '../pages/PDFReport';
import Profile from '../pages/Profile';
import Property from '../pages/Property';
import PropertyList from '../pages/PropertyList';
import UserList from '../pages/UserManagementList';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RoleBasedRoute from './RoleBasedRoute';
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
				{
					element: <RoleBasedRoute allowedRoles={['SuperAdmin']} />,
					children: [{ path: '/companies', element: <CompanyList /> }],
				},
				{ path: '/properties', element: <PropertyList /> },
				{ path: '/properties/:id', element: <Property /> },
				{
					path: '/properties/:id/compliance-reports',
					element: <ComplianceReports />,
				},
				{
					path: '/properties/:id/compliance-reports/:reportId',
					element: <ComplianceOverview />,
				},
				{ path: '/users', element: <UserList /> },
				{ path: '/profile', element: <Profile /> },
				{
					path: '/properties/:id/compliance-reports/:reportId/pdf',
					element: <PDFReport />,
				},
			],
		},
	];
	return useRoutes(appRoutes);
};

export default AppRoutes;
