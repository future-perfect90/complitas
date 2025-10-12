import { useAuth0 } from '@auth0/auth0-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthMeta = {
	roles?: string[];
	userUuid?: string;
	companyUuid?: string;
	isAuthenticated: boolean;
	isLoading: boolean;
	auth0sub?: string;
};

export const AuthContext = createContext<AuthMeta | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		isAuthenticated,
		getIdTokenClaims,
		isLoading: isAuth0Loading,
		loginWithRedirect,
	} = useAuth0();
	const [meta, setMeta] = useState<AuthMeta>({
		isAuthenticated: false,
		roles: [],
		isLoading: true,
	});

	useEffect(() => {
		// If the Auth0 SDK is still loading, our provider is also loading.
		if (isAuth0Loading) {
			setMeta((prev) => ({ ...prev, isLoading: true }));
			return;
		}

		// If the user is not authenticated, we are done loading.
		if (!isAuthenticated) {
			setMeta({ isAuthenticated: false, roles: [], isLoading: false });
			return;
		}

		// If the user is authenticated, fetch the claims.
		const fetchClaims = async () => {
			const claims = await getIdTokenClaims();
			const roles = claims ? claims['https://complitas.dev/roles'] : undefined;
			const userUuid =
				claims ? claims['https://complitas.dev/user_uuid'] : undefined;
			const companyUuid =
				claims ? claims['https://complitas.dev/company_uuid'] : undefined;
			const tokenExpiry = claims ? claims.exp : undefined;
			const now = Date.now() / 1000;
			const auth0sub = claims ? claims.sub : undefined;

			if (tokenExpiry && tokenExpiry < now) {
				// Token is expired, redirect to login
				await loginWithRedirect();
				return;
			}

			setMeta({
				userUuid,
				companyUuid,
				isAuthenticated,
				roles,
				isLoading: false,
				auth0sub,
			});
		};

		fetchClaims();
	}, [isAuthenticated, getIdTokenClaims, isAuth0Loading, loginWithRedirect]);

	return <AuthContext.Provider value={meta}>{children}</AuthContext.Provider>;
};

export function useAuthMeta() {
	return useContext(AuthContext) as AuthMeta;
}
