import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthMeta } from '../context/AuthProvider';

export const useRequireAuth = () => {
	const { isAuthenticated, isLoading } = useAuthMeta();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/logout');
		}
	}, [isLoading, isAuthenticated, navigate]);
};
