import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import './style/style.scss';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';

import { AuthProvider } from './components/AuthContext';

const root = createRoot(document.getElementById('root'));

root.render(
	<AuthProvider>
		<BrowserRouter>
			<Navbar />
			<div className="hero is-fullheight">
				<Routes>
					<Route path="/" element={<Home />} />

					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/verify/:token" element={<Verify />} />
				</Routes>
			</div>
			<Footer />
		</BrowserRouter>
	</AuthProvider>
);
