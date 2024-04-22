import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<section className="hero is-fullheight header-image">
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title">Welcome to Madeline's Journey</h1>
					<h2 className="subtitle">
						A tool to help you track your progress in Celeste.
					</h2>

					<Link to="/login" className="button is-primary mr-4">
						Login
					</Link>
					<Link to="/register" className="button is-link">
						Register
					</Link>
				</div>
			</div>
		</section>
	);
}
