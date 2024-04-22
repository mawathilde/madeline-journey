import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export default function Verify() {
	const { token } = useParams();
	const [loading, setLoading] = useState(false);

	const [status, setStatus] = useState(null);

	useEffect(() => {
		setLoading(true);
		api
			.post('auth/verify', { token })
			.then(response => {
				setStatus({ type: 'success', message: response.data.message });
			})
			.catch(error => {
				if (error.response.data) {
					setStatus({ type: 'danger', message: error.response.data.message });
				} else {
					setStatus({
						type: 'danger',
						message:
							'An error occurred. Please check your connection and try again.',
					});
				}
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
					{status && (
						<div className={`notification is-${status.type}`}>
							<button
								className="delete"
								onClick={() => setStatus(null)}
							></button>
							{status.message}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
