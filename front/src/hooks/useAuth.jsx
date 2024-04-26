import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

export default function useAuth() {
	const { token, setToken_, loading } = useContext(AuthContext);

	const isAuthenticated = () => {
		return token !== null;
	};

	const setToken = token => {
		setToken_(token);
		localStorage.setItem('token', token);
	};

	const removeToken = () => {
		setToken_(null);
		localStorage.removeItem('token');
	};

	return {
		isAuthenticated,
		setToken,
		removeToken,
		loading,
	};
}
