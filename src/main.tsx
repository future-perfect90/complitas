import { Auth0Provider } from '@auth0/auth0-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Auth0Provider
				domain={import.meta.env.VITE_AUTH0_DOMAIN}
				clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
				authorizationParams={{
					redirect_uri: `${window.location.origin}/dashboard`,
					audience: `${import.meta.env.VITE_AUTH0_AUDIENCE}`,
					scope: 'read:current_user_metadata',
				}}
				cacheLocation="localstorage"
				useRefreshTokens={true}>
				<App />
			</Auth0Provider>
			<ToastContainer position="top-right" autoClose={2000} hideProgressBar />
		</BrowserRouter>
	</StrictMode>
);
