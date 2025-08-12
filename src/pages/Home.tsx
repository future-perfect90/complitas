import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

function Home() {
	const { isAuthenticated, getAccessTokenSilently, user, isLoading } =
		useAuth0();

	useEffect(() => {
		const storeToken = async () => {
			try {
				const token = await getAccessTokenSilently();
				localStorage.setItem('auth_token', token);
			} catch (err) {
				console.error('Token fetch error', err);
			}
		};
		if (isAuthenticated) {
			storeToken();
		}
	}, [isAuthenticated, getAccessTokenSilently]);
	return (
		<>
			<h1>Welcome to the Home Page</h1>
			<p>This is the home page of our application.</p>
		</>
	);
}
export default Home;
