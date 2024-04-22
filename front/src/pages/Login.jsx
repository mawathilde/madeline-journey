import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import { useToasts } from '../hooks/useToast';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [loading, setLoading] = useState(false);

	const { setToken } = useAuth();
	const navigate = useNavigate();

	const toasts = useToasts();

	const handleSubmit = event => {
		event.preventDefault();
		setLoading(true);

		api
			.post('auth/login', { username, password })
			.then(response => {
				setToken(response.data.token);
				toasts.pushToast({
					message: 'Logged in successfully.',
					type: 'success',
				});
				navigate('/');
			})
			.catch(error => {
				toasts.pushToast({
					message:
						error.response.data.message ||
						'An error occurred, please check your connection and try again.',
					type: 'danger',
				});
			})
			.finally(() => {
				setLoading(false);
				setPassword('');
			});
	};

	return (
		<form className="section" onSubmit={handleSubmit}>
			<div className="container">
				<div className="columns is-centered">
					<div className="column is-half">
						<div className="box">
							<div className="content">
								<div className="title">Log In</div>
								<div className="subtitle">Log in to your account</div>
							</div>
							<div className="field">
								<label className="label">Username</label>
								<div className="control has-icons-left">
									<input
										value={username}
										onChange={e => setUsername(e.target.value)}
										className="input"
										type="text"
									/>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faUser} />
									</span>
								</div>
							</div>
							<div className="field">
								<label className="label">Password</label>
								<div className="control has-icons-left">
									<input
										value={password}
										onChange={e => setPassword(e.target.value)}
										className="input"
										type="password"
									/>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faLock} />
									</span>
								</div>
							</div>
							<div className="field is-grouped">
								<div className="control">
									<button
										type="submit"
										className={`button is-primary ${loading ? 'is-loading' : ''}`}
									>
										Login
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
