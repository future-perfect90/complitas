import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

function Home() {
	const { loginWithRedirect } = useAuth0();
	useEffect(() => {
		loginWithRedirect({ appState: { returnTo: '/dashboard' } });
	}, []);

	return <></>;
}
export default Home;
