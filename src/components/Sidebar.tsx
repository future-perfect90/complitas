import { useAuth0 } from '@auth0/auth0-react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthMeta } from '../context/AuthProvider';

const Sidebar = () => {
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
				{ name: 'My Profile', href: '/profile', current: false },
				{ name: 'Dashboard', href: '/dashboard', current: false },
				{ name: 'Properties', href: '/properties', current: false },
				{ name: 'Users', href: '/users', current: false },
			];
	if (isAuthenticated && isSuperAdmin) {
		navigation.splice(1, 0, {
			name: 'Companies',
			href: '/companies',
			current: false,
		});
	}

	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<div className="md:hidden fixed top-4 left-4 z-40">
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="p-2 rounded-md text-[#F8F9FA] bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
					<span className="sr-only">Open sidebar</span>
					{sidebarOpen ?
						<XMarkIcon className="h-6 w-6" aria-hidden="true" />
					:	<Bars3Icon className="h-6 w-6" aria-hidden="true" />}
				</button>
			</div>

			<div
				className={clsx(
					'fixed inset-y-0 left-0 z-30 w-48 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col',
					{
						'translate-x-0': sidebarOpen,
						'-translate-x-full': !sidebarOpen,
					}
				)}>
				<div className="flex items-center justify-center h-16 bg-gray-200 text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-700 flex-shrink-0">
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
							onClick={() => setSidebarOpen(false)}
							end={item.href === '/'}
							className={({ isActive }) =>
								clsx(
									'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
									isActive ?
										'bg-[#FFFFFF] text-[#212529]'
									:	'text-[#212529] dark:text-[#F8F9FA] hover:bg-[#FFFFFF] hover:text-[#212529]'
								)
							}>
							{item.name}
						</NavLink>
					))}
					{isAuthenticated ?
						<NavLink
							to="#"
							onClick={() =>
								logout({
									logoutParams: { returnTo: window.location.origin },
								})
							}
							className={
								'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-[#212529] dark:text-[#F8F9FA] hover:bg-[#FFFFFF] hover:text-[#212529]'
							}>
							Log out
						</NavLink>
					:	<NavLink
							to="#"
							onClick={() => loginWithRedirect()}
							className={
								'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-[#212529] dark:text-[#F8F9FA] hover:bg-[#FFFFFF] hover:text-[#212529]'
							}>
							Log in
						</NavLink>
					}
				</nav>
			</div>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</>
	);
};

export default Sidebar;
