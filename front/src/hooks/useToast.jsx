import { useCallback, useContext } from 'react';

import { ToastContext } from '../components/ToastContext';

export function useToasts() {
	const { pushToastRef } = useContext(ToastContext);
	return {
		pushToast: useCallback(
			toast => {
				pushToastRef.current(toast);
			},
			[pushToastRef]
		),
	};
}
