import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function Login() {
	const [loading, setLoading] = useState(false);

	const handleSubmit = event => {
		event.preventDefault();
		setLoading(true);
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
									<input className="input" type="text" />
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faUser} />
									</span>
								</div>
							</div>
							<div className="field">
								<label className="label">Password</label>
								<div className="control has-icons-left">
									<input className="input" type="password" />
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
