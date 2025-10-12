import { useAuthMeta } from '../context/AuthProvider';

export default function Dashboard() {
	const authMeta = useAuthMeta();
	const isAuthenticated = authMeta;

	return (
		<>
			{isAuthenticated ?
				<>
					<h2 className="text-3xl">Welcome to your dashboard</h2>
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
