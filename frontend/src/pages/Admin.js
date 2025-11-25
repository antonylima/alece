import { useState, useEffect } from 'react';
import { supabase } from '../util/supabase';
import './Admin.css';

function Admin() {
  const [deputados, setDeputados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeputado, setEditingDeputado] = useState(null);
  const [formData, setFormData] = useState({
    deputado: '',
    sigla: '',
    mesa: null,
    licenciado: false
  });

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

        if (hasMesaA && !hasMesaB) return -1;
        if (!hasMesaA && hasMesaB) return 1;

        if (hasMesaA && hasMesaB) {
          const mesaDiff = a.mesa - b.mesa;
          if (mesaDiff !== 0) {
            return mesaDiff;
          }
        }

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

  const openModal = (deputado = null) => {
    if (deputado) {
      setEditingDeputado(deputado);
      setFormData({
        deputado: deputado.deputado,
        sigla: deputado.sigla,
        mesa: deputado.mesa || '',
        licenciado: deputado.licenciado
      });
    } else {
      setEditingDeputado(null);
      setFormData({
        deputado: '',
        sigla: '',
        mesa: '',
        link: '',
        suplente: '',
        licenciado: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDeputado(null);
    setFormData({
      deputado: '',
      sigla: '',
      mesa: '',
      link: '',
      suplente: '', 
      licenciado: false
    });
  };

  const handleSubmit = async () => {
    if (!formData.deputado || !formData.sigla) {
      setError('Nome do deputado e partido são obrigatórios');
      return;
    }

    const dataToSave = {
      ...formData,
      mesa: formData.mesa === '' ? null : parseInt(formData.mesa)
    };

    try {
      if (editingDeputado) {
        const { error } = await supabase
          .from('ctp')
          .update(dataToSave)
          .eq('id', editingDeputado.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ctp')
          .insert([dataToSave]);

        if (error) throw error;
      }

      closeModal();
      fetchData();
    } catch (err) {
      setError(`Falha ao salvar: ${err.message}`);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este deputado?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ctp')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDeputados((prev) => prev.filter((dep) => dep.id !== id));
    } catch (err) {
      setError(`Falha ao excluir: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return <div className="admin-container">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error">{error}</div>
        <button onClick={fetchData} className="refresh-btn">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
      
      <div className="action-buttons">
        <button onClick={() => openModal()} className="add-btn">
          + Novo Deputado
        </button>
        <button onClick={fetchData} className="refresh-btn">
          Atualizar Lista
        </button>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Deputado</th>
              <th>Partido</th>
              <th>Mesa</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {deputados.map((dep) => (
              <tr key={dep.id} className={dep.licenciado ? 'licenciado' : ''}>
                <td data-label="Deputado">{dep.deputado}</td>
                <td data-label="Partido">{dep.sigla}</td>
                <td data-label="Mesa">{dep.mesa || '-'}</td>
                <td data-label="Status">{dep.licenciado ? 'Licenciado' : 'Ativo'}</td>
                <td data-label="Ações">
                  <div className="action-buttons-cell">
                    <button
                      onClick={() => handleToggleLicenciado(dep.id, dep.licenciado)}
                      className="toggle-btn"
                      title={dep.licenciado ? 'Tornar Ativo' : 'Tornar Licenciado'}
                    >
                      {dep.licenciado ? 'Ativar' : 'Licenciar'}
                    </button>
                    <button
                      onClick={() => openModal(dep)}
                      className="edit-btn"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(dep.id)}
                      className="delete-btn"
                      title="Excluir"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingDeputado ? 'Editar Deputado' : 'Novo Deputado'}</h2>
            
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="deputado">Nome do Deputado *</label>
                <input
                  type="text"
                  id="deputado"
                  value={formData.deputado}
                  onChange={(e) => setFormData({ ...formData, deputado: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sigla">Partido *</label>
                <input
                  type="text"
                  id="sigla"
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mesa">Mesa</label>
                <input
                  type="number"
                  id="mesa"
                  value={formData.mesa}
                  onChange={(e) => setFormData({ ...formData, mesa: e.target.value })}
                  placeholder="Deixe vazio se não pertence à mesa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sigla">Link</label>
                <input
                  type="text"
                  id="sigla"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.licenciado}
                    onChange={(e) => setFormData({ ...formData, licenciado: e.target.checked })}
                  />
                  <span>Licenciado</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="button" onClick={handleSubmit} className="save-btn">
                  {editingDeputado ? 'Salvar Alterações' : 'Criar Deputado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;