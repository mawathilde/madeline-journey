import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import './style/style.scss';

const root = createRoot(document.getElementById('root'));

const MainPage = () => (
	<section className="section">
		<div className="container">
			<h1 className="title">Hello</h1>
			<p className="subtitle">Welcome to the Celeste Progression Tracker!</p>
		</div>
	</section>
);

root.render(
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="/" element={<MainPage></MainPage>} />
		</Routes>
	</BrowserRouter>
);
