import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MovieList from './pages/MovieList';
import './App.css'; // Mantenha ou adicione este arquivo CSS para estilos básicos

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/movies">Lista de Filmes</Link>
            </li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<MovieList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;