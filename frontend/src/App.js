
import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getDeputados } from './Api';
import Admin from './pages/Admin';
import PrivateRoute from './auth/PrivateRoute';
import Comissoes from './pages/Comissoes.js';
import './App.css';

// Extracted component for the main list
function DeputadosList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDeputados();
        const sortedData = data.sort((a, b) => {
          const hasMesaA = a.mesa != null;
          const hasMesaB = b.mesa != null;

          // Prioritize deputies who are on the 'mesa'
          if (hasMesaA && !hasMesaB) return -1;
          if (!hasMesaA && hasMesaB) return 1;

          // If both are on the 'mesa', sort by 'mesa' number numerically
          if (hasMesaA && hasMesaB) {
            const mesaDiff = a.mesa - b.mesa;
            if (mesaDiff !== 0) {
              return mesaDiff;
            }
          }

          // For deputies with the same 'mesa' status, sort by name
          return a.deputado.localeCompare(b.deputado);
        });
        setTodos(sortedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="deputados-container">
      <h2 className="list-title">Deputados</h2>
      <ul className="deputados-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`deputado-item ${
              todo.licenciado ? 'licenciado-item' : ''
            }`}
          >
            <a
              href={todo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="deputado-link"
            >
              {todo.deputado}
            </a>
            <div className="deputado-details">
              <span className="deputado-sigla">{todo.sigla}</span>
              {todo.role && <span className="role">{todo.role}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <div>
      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/comissoes">Comissões</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<DeputadosList />} />
          <Route path="/comissoes" element={<Comissoes />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

