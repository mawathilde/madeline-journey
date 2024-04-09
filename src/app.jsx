import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import './style/style.scss';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';

const root = createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="/" element={<Home />} />

			<Route path="/login" element={<Login />} />
		</Routes>
		<Footer />
	</BrowserRouter>
);
