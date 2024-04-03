import React from 'react';
import {createRoot} from 'react-dom/client';
import {
    BrowserRouter,
    Route,
    Routes,
  } from "react-router-dom";

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<h1>Hello</h1>}/>
        </Routes>
    </BrowserRouter>
);