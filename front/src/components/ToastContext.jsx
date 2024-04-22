import React, { createContext, useRef } from 'react';
import { Toasts } from './Toasts';

const defaultPush = toast => {}; // Méthode de base que l'on mettra dans le contexte par défaut

const ToastContext = createContext({
	pushToastRef: { current: defaultPush },
});

export { ToastContext };

// On entourera notre application de ce provider pour rendre le toasts fonctionnel
export function ToastContextProvider({ children }) {
	const pushToastRef = useRef(defaultPush);
	return (
		<ToastContext.Provider value={{ pushToastRef }}>
			<Toasts />
			{children}
		</ToastContext.Provider>
	);
}
