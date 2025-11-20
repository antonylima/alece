import { useState } from 'react';
import Login from '../pages/Login';

function PrivateRoute({ children }) {
  // Using session storage allows the user to stay logged in during the browser session (including reloads).
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const handleLogin = () => {
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return children;
}

export default PrivateRoute;
