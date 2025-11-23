import { useState, useEffect } from 'react';
import { supabase } from '../util/supabase';
import './Admin.css';

function Admin() {
  const [deputados, setDeputados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('ctp').select('*');

      if (error) {
        throw error;
      }

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
      setDeputados(sortedData);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar os dados. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleLicenciado = async (id, currentStatus) => {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('ctp')
        .update({ licenciado: !currentStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the state locally to reflect the change immediately
      if (updatedRecord) {
        setDeputados((prevDeputados) =>
          prevDeputados.map((dep) =>
            dep.id === id ? { ...dep, licenciado: updatedRecord.licenciado } : dep
          )
        );
      }
    } catch (err) {
      setError(`Falha ao atualizar o status do ID ${id}.`);
      console.error(err);
    }
  };

  if (loading) {
    return <div className="admin-container">Carregando...</div>;
  }

  if (error) {
    return <div className="admin-container error">{error}</div>;
  }

  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
      <button onClick={fetchData} className="refresh-btn">Atualizar Lista</button>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Deputado</th>
              <th>Partido</th>
              <th>Mesa</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {deputados.map((dep) => (
              <tr key={dep.id} className={dep.licenciado ? 'licenciado' : ''}>
                <td>{dep.deputado}</td>
                <td>{dep.sigla}</td>
                <td>{dep.mesa}</td>
                <td>{dep.licenciado ? 'Licenciado' : 'Ativo'}</td>
                <td>
                  <button
                    onClick={() => handleToggleLicenciado(dep.id, dep.licenciado)}
                    className="toggle-btn"
                  >
                    {dep.licenciado ? 'Tornar Ativo' : 'Tornar Licenciado'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;