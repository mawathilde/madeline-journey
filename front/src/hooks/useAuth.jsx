import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

export default function useAuth() {
	const { token, setContextToken, loading } = useContext(AuthContext);

	const isAuthenticated = () => {
		return token !== null;
	};

	const setToken = token => {
		setContextToken(token);
		localStorage.setItem('token', token);
	};

	const removeToken = () => {
		setContextToken(null);
		localStorage.removeItem('token');
	};

	return {
		isAuthenticated,
		setToken,
		removeToken,
		loading,
	};
}
