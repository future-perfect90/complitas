import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Navigation() {
	const { isAuthenticated } = useAuth0();
	let navLinks;
	if (!isAuthenticated) {
		navLinks = [
			{ title: 'Home', href: '/' },
			{ title: 'About', href: '/about' },
			{ title: 'Log in', href: '/login' },
		];
	} else {
		navLinks = [
			{ title: 'Dashboard', href: '/dashboard' },
			{ title: 'Log out', href: '/logout' },
		];
	}

	return (
		<nav className="flex justify-between items-center bg-white shadow-md py-4 px-4 md:px-8">
			<div className="text-xl md:text-2xl font-bold">
				<Link to="/">
					<img className="w-30 h-3xs" src="tlogo_text.png" />
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
			</div>
		</nav>
	);
}
