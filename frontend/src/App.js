import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './util/supabase';
import Admin from './pages/Admin';
import PrivateRoute from './auth/PrivateRoute';
import Comissoes from './pages/Comissoes.js';
import './App.css';

/*async function atualizaStatus(supabase, id, valor) {
  const { data, error } = await supabase
    .from('ctp')
    .update({ licenciado: valor })
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao atualizar:', error);
    return { sucesso: false, erro: error };
  }
  
  return { sucesso: true, data };
}

const hoje = new Date();

if((hoje.getDate()+"-"+(hoje.getMonth()+1)+"-"+hoje.getFullYear()) == '01-12-2025') {
    await atualizaStatus(supabase, 7, false);
}*/



// Extracted component for the main list
function DeputadosList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca dados diretamente do Supabase
        const { data, error } = await supabase
          .from('ctp')
          .select('*');

        if (error) {
          throw error;
        }

        // Ordena os dados da mesma forma que antes
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
  
  const sp = "";
  
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
            <div className="deputado-row-1">
              <a
                href={todo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="deputado-link"
              >
                {todo.deputado}
              </a>
              <span>&nbsp;&nbsp;</span>
              <span className="deputado-sigla">{sp}{todo.sigla}</span>
            </div>
            <div className="deputado-row-2">
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
