import { Link } from 'react-router-dom';

export default function Navbar() {
	return (
		<nav className="navbar" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					<h1 className="title">Madeline's Journey</h1>
				</Link>
			</div>

			<div className="navbar-menu">
				<div className="navbar-start">
					<a className="navbar-item" href="/berries">
						Berries
					</a>
				</div>
			</div>
		</nav>
	);
}
