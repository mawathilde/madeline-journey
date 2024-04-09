import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import './style/style.scss';
import Footer from './components/Footer';

const root = createRoot(document.getElementById('root'));

const MainPage = () => (
	<section className="hero is-fullheight">
		<div className="hero-body">
			<div className="container has-text-centered">
				<h1 className="title">Welcome to Madeline's Journey</h1>
				<h2 className="subtitle">
					A tool to help you track your progress in Celeste.
				</h2>
				<button className="button is-primary mr-4">Login</button>
				<button className="button is-link">Register</button>
			</div>
		</div>
	</section>
);

root.render(
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="/" element={<MainPage></MainPage>} />
		</Routes>
		<Footer />
	</BrowserRouter>
);
