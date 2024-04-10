import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { faMoon } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
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
				<div className="navbar-item">
					<FontAwesomeIcon icon={faMoon} size="xl" color="#9b59b6" />
				</div>
			</div>
		</nav>
	);
}
