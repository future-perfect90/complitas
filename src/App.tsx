import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routing/AppRouting';
import './styles/App.css';
import { setAuthService } from './utils/authService';

function App() {
	const { getAccessTokenSilently, isAuthenticated } = useAuth0();

	useEffect(() => {
		if (isAuthenticated) {
			setAuthService(getAccessTokenSilently);
		}
	}, [isAuthenticated, getAccessTokenSilently]);

	return (
		<>
			<AuthProvider>
				<Navigation />
				<main className="flex-1 flex flex-col p-8 w-full box-border">
					<AppRoutes />
				</main>
			</AuthProvider>
		</>
	);
}

export default App;
