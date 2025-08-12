import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export default function Dashboard() {
	const { user, isAuthenticated, isLoading, getAccessTokenWithPopup } =
		useAuth0();

	useEffect(() => {
		const fetchToken = async () => {
			try {
				// Opens a small popup and gets the token without redirect
				const token = await getAccessTokenWithPopup({
					authorizationParams: {
						audience: import.meta.env.VITE_AUTH0_AUDIENCE,
					},
				});
				localStorage.setItem('auth_token', token || '');
			} catch (err) {
				console.error('Token fetch error', err);
			}
		};

		if (isAuthenticated) {
			fetchToken();
		}
	}, [isAuthenticated, getAccessTokenWithPopup]);

	if (isLoading) return <div>Loading ...</div>;

	return (
		<>
			<h1>Dashboard</h1>

			{isAuthenticated ?
				<>
					<h2 className="text-3xl">Welcome to your dashboard {user?.name}</h2>
					<br />
					<p>
						This is your personal dashboard where you can manage your settings
						and view your data.
					</p>
					<label className="block mt-4">Profile Picture</label>

					<img
						className="rounded-full w-24 h-24"
						src={user?.picture}
						alt={user?.name}
					/>
					<label className="block mt-2">Name</label>
					<h2>{user?.name}</h2>
					<label className="block mt-2">Email</label>
					<p>{user?.email}</p>
				</>
			:	'Error: Getting user information failed. Please try again later.'}
		</>
	);
}
