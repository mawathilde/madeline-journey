import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken_] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		setToken_(storedToken);
		setLoading(false);
	}, []);

	return (
		<AuthContext.Provider value={{ token, setToken_, loading }}>
			{children}
		</AuthContext.Provider>
	);
};
