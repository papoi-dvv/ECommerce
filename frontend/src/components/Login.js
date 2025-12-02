import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import './Auth.css';

const Login = ({ onVolver, onCambiarARegistro }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const loginMutation = useLogin();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        onVolver();
      }
    });
  };

  return (
    <div className="auth-container">
      <button onClick={onVolver} className="btn-volver">
        ← Volver
      </button>
      
      <div className="auth-form">
        <h1>🔐 Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        {loginMutation.error && (
          <div className="error-message">
            {loginMutation.error.message}
          </div>
        )}
        
        <div className="auth-switch">
          <p>¿No tienes cuenta? 
            <button onClick={onCambiarARegistro} className="btn-link">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;