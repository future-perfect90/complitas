import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthMeta } from '../context/AuthProvider';

// const navigation = [
// 	{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
// 	{ name: 'Sites', href: '/sites', icon: TentTree },
// 	{ name: 'Invoices', href: '/invoices', icon: Book },
// 	{ name: 'Movements', href: '/movements', icon: Truck },
// 	{ name: 'Containers on Site', href: '/containers', icon: Box },
// 	{ name: 'Pending Orders', href: '/pendingOrders', icon: Loader },
// 	{ name: 'Cost Report', href: '/cost-report', icon: HandCoins },
// 	{ name: 'Recycling report', href: '/recycling', icon: Recycle },
// 	{ name: 'Adhoc Carbon Emissions', href: '/carbon', icon: Activity },
// 	{ name: 'Quotes', href: '/quotes', icon: CirclePoundSterling },
// 	{ name: 'Site Inspection Logs', href: '/inspection', icon: UserSearch },
// ];

const Sidebar = () => {
	const location = useLocation();
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
	const authMeta = useAuthMeta();
	const isSuperAdmin = authMeta?.roles?.includes('SuperAdmin');

	let navigation =
		!isAuthenticated ?
			[
				{ name: 'Home', href: '/', current: true },
				{ name: 'About', href: '/about', current: false },
			]
		:	[
				{ name: 'Dashboard', href: '/dashboard', current: false },
				{ name: 'Properties', href: '/properties', current: false },
				{ name: 'Users', href: '/users', current: false },
				{ name: 'Teams', href: '/teams', current: false },
			];
	if (isAuthenticated && isSuperAdmin) {
		navigation.splice(1, 0, {
			name: 'Companies',
			href: '/companies',
			current: false,
		});
	}
	return (
		<div className="flex flex-col w-64 bg-gray-800 text-gray-100">
			<div className="flex items-center justify-center h-16 bg-gray-900">
				<img
					className="h-8 w-8"
					src="/complitas_logo_without_text.png"
					alt="Complitas Logo"
				/>
				<span className="ml-2 text-xl font-bold">Complitas</span>
			</div>
			<nav className="flex-1 px-2 py-4 space-y-2">
				{navigation.map((item) => (
					<NavLink
						key={item.name}
						to={item.href}
						end={item.href === '/'}
						className={({ isActive }) =>
							clsx(
								'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
								isActive ?
									'bg-gray-900 text-white'
								:	'text-gray-300 hover:bg-gray-700 hover:text-white'
							)
						}>
						{/* <item.icon className="h-6 w-6 mr-3" aria-hidden="true" /> */}
						{item.name}
					</NavLink>
				))}
			</nav>
		</div>
	);
};

export default Sidebar;
