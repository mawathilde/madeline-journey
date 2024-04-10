import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setContextToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		setContextToken(storedToken);
		setLoading(false);
	}, []);

	return (
		<AuthContext.Provider value={{ token, setContextToken, loading }}>
			{children}
		</AuthContext.Provider>
	);
};
