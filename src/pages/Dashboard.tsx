import { useAuth0 } from '@auth0/auth0-react';

export default function Dashboard() {
	const { user, isAuthenticated } = useAuth0();

	return (
		<>
			<h1>Todo List</h1>
			<h2>TODO::Notification endpoint to enable SNS</h2>
			{isAuthenticated ?
				<>
					<h2 className="text-3xl">Welcome to your dashboard {user?.name}</h2>
					<br />
					<p>
						This is your personal dashboard where you can manage your settings
						and view your data.
					</p>
				</>
			:	'Error: Getting user information failed. Please try again later.'}
		</>
	);
}
