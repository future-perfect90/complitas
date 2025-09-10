import { type GetTokenSilentlyOptions } from '@auth0/auth0-react';

type GetTokenSilently = (options?: GetTokenSilentlyOptions) => Promise<string>;

const authService: {
	getAccessTokenSilently?: GetTokenSilently;
} = {};

export const setAuthService = (getToken: GetTokenSilently) => {
	authService.getAccessTokenSilently = getToken;
};

export default authService;
