import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOTE: This is a simple, hardcoded password.
    // For a real application, use a proper authentication backend.
    if (password === 'alecesiteadmin') {
      setError('');
      onLogin();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Acesso Restrito</h2>
        <p>Por favor, insira a senha para acessar a área administrativa.</p>
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
