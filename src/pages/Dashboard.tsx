import { useAuth0 } from '@auth0/auth0-react';

export default function Dashboard() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading ...</div>;
	}

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
