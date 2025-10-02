import type { AppState } from '@auth0/auth0-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx';

const Auth0ProviderWithRedirectCallback = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const posthog = usePostHog();

	const onRedirectCallback = (appState?: AppState, user?: any) => {
		if (user) {
			posthog?.identify(user['https://complitas.dev/user_uuid'], {
				email: user.email,
				name: user.name,
			});
			posthog?.capture('user_logged_in');
		}
		window.history.replaceState(
			{},
			document.title,
			appState?.returnTo || window.location.pathname
		);
	};

	return (
		<Auth0Provider
			domain={import.meta.env.VITE_AUTH0_DOMAIN}
			clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
			onRedirectCallback={onRedirectCallback}
			authorizationParams={{
				redirect_uri: `${window.location.origin}/dashboard`,
				audience: `${import.meta.env.VITE_AUTH0_AUDIENCE}`,
				scope: 'read:current_user_metadata',
			}}
			cacheLocation="localstorage"
			useRefreshTokens={true}>
			{children}
		</Auth0Provider>
	);
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PostHogProvider
			apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
			options={{ api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST }}>
			<BrowserRouter>
				<Auth0ProviderWithRedirectCallback>
					<App />
				</Auth0ProviderWithRedirectCallback>
				<ToastContainer position="top-right" autoClose={2000} hideProgressBar />
			</BrowserRouter>
		</PostHogProvider>
	</StrictMode>
);
