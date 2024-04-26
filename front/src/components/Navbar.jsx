import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';

import { faMoon } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import { useToasts } from '../hooks/useToast';

export default function Navbar() {
	const { isAuthenticated, removeToken } = useAuth();

	const navigate = useNavigate();
	const toasts = useToasts();

	const logout = event => {
		event.preventDefault();

		removeToken();
		toasts.pushToast({
			message: 'Logged out successfully',
			type: 'success',
		});
		navigate('/');
	};

	return (
		<nav className="navbar" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					<h1 className="title">Madeline's Journey</h1>
				</Link>
			</div>

			<div className="navbar-menu">
				<div className="navbar-start"></div>
			</div>
			<div className="navbar-end">
				{isAuthenticated() && (
					<div className="navbar-item">
						<Link className="button is-danger" onClick={logout}>
							Logout
						</Link>
					</div>
				)}

				<div className="navbar-item">
					<FontAwesomeIcon icon={faMoon} size="xl" color="#9b59b6" />
				</div>
			</div>
		</nav>
	);
}
