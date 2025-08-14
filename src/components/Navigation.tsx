import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

export default function Navigation() {
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
	const navLinks =
		!isAuthenticated ?
			[
				{ title: 'Home', href: '/' },
				{ title: 'About', href: '/about' },
			]
		:	[
				{ title: 'Dashboard', href: '/dashboard' },
				{ title: 'Companies', href: '/companies' },
				{ title: 'Properties', href: '/properties' },
				{ title: 'Users', href: '/users' },
			];

	return (
		<nav className="flex justify-between items-center bg-white shadow-md py-4 px-4 md:px-8">
			<div className="text-xl md:text-2xl font-bold">
				<Link to="/">
					<img className="w-30 h-3xs" src="complitas_logo_with_text.png" />
				</Link>
			</div>
			<div className="flex gap-4 md:gap-8">
				{navLinks.map((link) => (
					<Link
						to={link.href}
						key={link.title}
						className="text-base p-2 md:py-2 md:px-4 rounded transition-colors duration-200 hover:bg-white/10">
						{link.title}
					</Link>
				))}
				{!isAuthenticated ?
					<Button
						label="Log in"
						onClick={() => loginWithRedirect()}
						className="text-base p-2 md:py-2 md:px-4 text-[#646cff] disabled:hover"
					/>
				:	<Button
						label="Log out"
						onClick={() =>
							logout({ logoutParams: { returnTo: window.location.origin } })
						}
						className="text-base p-2 md:py-2 md:px-4 text-[#646cff] disabled:hover"
					/>
				}
			</div>
		</nav>
	);
}
