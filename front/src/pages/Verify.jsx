import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useToasts } from '../hooks/useToast';

export default function Verify() {
	const { token } = useParams();
	const [loading, setLoading] = useState(false);

	const toasts = useToasts();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		api
			.post('auth/verify', { token })
			.then(response => {
				toasts.pushToast({
					message: 'Account verified successfully, you can now log in.',
					type: 'success',
					duration: 10,
				});
				navigate('/login');
			})
			.catch(error => {
				toasts.pushToast({
					type: 'danger',
					message:
						"Unable to verify your account. It's possible that the link has expired.",
				});
				navigate('/');
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="container">
			<div className="box mt-5">
				<h1 className="title">Verify your account</h1>
				<div className="content">
					{loading && (
						<progress className="progress is-small is-primary" max="100">
							15%
						</progress>
					)}
				</div>
			</div>
		</div>
	);
}
