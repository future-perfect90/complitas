import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export default function Dashboard() {
	const {
		user,
		isAuthenticated,
		isLoading,
		getAccessTokenWithPopup,
		getIdTokenClaims,
	} = useAuth0();

	useEffect(() => {
		const fetchToken = async () => {
			try {
				// Opens a small popup and gets the token without redirect
				const token = await getAccessTokenWithPopup({
					authorizationParams: {
						audience: import.meta.env.VITE_AUTH0_AUDIENCE,
					},
				});

				// const user = await getCurrentUser();
				localStorage.setItem('auth_token', token || '');
			} catch (err) {
				console.error('Token fetch error', err);
			}
		};

		const fetchClaims = async () => {
			const claims = await getIdTokenClaims();
			const uuid =
				claims ? claims['https://complitas.dev/user_uuid'] : undefined;
			const companyId =
				claims ? claims['https://complitas.dev/company_uuid'] : undefined;
			console.log('User UUID from token:', uuid);
			console.log('Company UUID from token:', companyId);
			// Store uuid in Context or global state for API calls
		};

		if (isAuthenticated) {
			fetchToken();
			fetchClaims();
		}
	}, [isAuthenticated, getAccessTokenWithPopup, getIdTokenClaims]);

	if (isLoading) return <div>Loading ...</div>;
	return (
		<>
			<h1>Dashboard</h1>
			<h2>TODO::Lock down API's to use Auth0 token</h2>
			<h2>TODO::PDF generator for html</h2>
			<h2>TODO::Upload files endpoint to s3 bucket via presigned URL</h2>
			<h2>
				TODO::Notification endpoint to accept email address to send email via
				SES
			</h2>
			<h2>TODO::Notification endpoint to enable SNS</h2>
			{isAuthenticated ?
				<>
					<h2 className="text-3xl">Welcome to your dashboard {user?.name}</h2>
					<br />
					<p>
						This is your personal dashboard where you can manage your settings
						and view your data.
					</p>
					<label className="block mt-2">Name</label>
					<h2>{user?.name}</h2>
					<label className="block mt-2">Email</label>
					<p>{user?.email}</p>
				</>
			:	'Error: Getting user information failed. Please try again later.'}
		</>
	);
}
