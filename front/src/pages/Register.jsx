import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import { useToasts } from '../hooks/useToast';

export default function Login() {
	const [username, setUsername] = useState('');
	const [mail, setMail] = useState('');
	const [password, setPassword] = useState('');
	const [repassword, setRepassword] = useState('');

	const [loading, setLoading] = useState(false);

	const [status, setStatus] = useState(null);

	const toasts = useToasts();

	const navigate = useNavigate();

	const handleSubmit = event => {
		event.preventDefault();

		if (password !== repassword) {
			toasts.pushToast({ type: 'danger', message: 'Passwords do not match.' });
			return;
		}

		setLoading(true);

		api
			.post('auth/register', { username, email: mail, password })
			.then(response => {
				toasts.pushToast({
					message: 'Account created successfully. Please verify your email.',
					type: 'success',
					duration: 30,
				});
				navigate('/login');
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
			});
	};

	return (
		<form className="section" onSubmit={handleSubmit}>
			<div className="container">
				<div className="columns is-centered">
					<div className="column is-half">
						<div className="box">
							<div className="content">
								<div className="title">Register</div>
								<div className="subtitle">Create an account</div>
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
								<label className="label">E-Mail</label>
								<div className="control has-icons-left">
									<input
										value={mail}
										onChange={e => setMail(e.target.value)}
										className="input"
										type="email"
									/>
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faEnvelope} />
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
							<div className="field">
								<label className="label">Retype Password</label>
								<div className="control has-icons-left">
									<input
										value={repassword}
										onChange={e => setRepassword(e.target.value)}
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
										Register
									</button>
								</div>
							</div>
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
			</div>
		</form>
	);
}
