import { AnimatePresence, motion } from 'framer-motion';
import { useState, useContext } from 'react';

import { ToastContext } from './ToastContext';

export default function Toast({ message, type }) {
	return <div className={`notification is-${type}`}>{message}</div>;
}

export function Toasts() {
	const [toasts, setToasts] = useState([]);
	// On modifie la méthode du contexte
	const { pushToastRef } = useContext(ToastContext);
	pushToastRef.current = ({ duration, ...props }) => {
		// On génère un id pour différencier les messages
		const id = Date.now();
		// On sauvegarde le timer pour pouvoir l'annuler si le message est fermé
		const timer = setTimeout(
			() => {
				setToasts(v => v.filter(t => t.id !== id));
			},
			(duration ?? 5) * 1000
		);
		const toast = { ...props, id, timer };
		setToasts(v => [...v, toast]);

		console.log(toast);
	};

	const onRemove = toast => {
		clearTimeout(toast.timer);
		setToasts(v => v.filter(t => t !== toast));
	};

	return (
		<div className="toast-container">
			<AnimatePresence>
				{toasts.map(toast => (
					<motion.div
						onClick={() => onRemove(toast)}
						key={toast.id}
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
					>
						<Toast {...toast} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
