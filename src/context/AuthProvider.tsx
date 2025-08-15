import { useAuth0 } from '@auth0/auth0-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthMeta = {
	userUuid?: string;
	companyUuid?: string;
	isAuthenticated: boolean;
	isLoading?: boolean;
};

export const AuthContext = createContext<AuthMeta | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated, getIdTokenClaims } = useAuth0();
	const [meta, setMeta] = useState<AuthMeta>({ isAuthenticated: false });

	useEffect(() => {
		const fetchClaims = async () => {
			const claims = await getIdTokenClaims();
			const userUuid =
				claims ? claims['https://complitas.dev/user_uuid'] : undefined;
			const companyUuid =
				claims ? claims['https://complitas.dev/company_uuid'] : undefined;
			setMeta({ userUuid, companyUuid, isAuthenticated });
		};
		if (isAuthenticated) {
			fetchClaims();
		} else {
			setMeta({ isAuthenticated: false });
		}
	}, [isAuthenticated, getIdTokenClaims]);

	return <AuthContext.Provider value={meta}>{children}</AuthContext.Provider>;
};

export function useAuthMeta() {
	return useContext(AuthContext);
}
