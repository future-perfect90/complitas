import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
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
				<div className="flex h-screen">
					<Sidebar />
					<main className="flex-1 flex flex-col p-8 pt-16 md:pt-8 w-full box-border overflow-y-auto">
						<div className="container mx-auto px-6 py-8">
							<AppRoutes />
						</div>
					</main>
				</div>
			</AuthProvider>
		</>
	);
}

export default App;
