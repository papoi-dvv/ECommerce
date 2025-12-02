import React, { useState } from 'react';
import { useRegistro } from '../hooks/useAuth';
import './Auth.css';

const Registro = ({ onVolver, onCambiarALogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  const registroMutation = useRegistro();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registroMutation.mutate(formData, {
      onSuccess: () => {
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        onCambiarALogin();
      }
    });
  };

  return (
    <div className="auth-container">
      <button onClick={onVolver} className="btn-volver">
        ← Volver
      </button>
      
      <div className="auth-form">
        <h1>📝 Crear Cuenta</h1>
        
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
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={registroMutation.isPending}
          >
            {registroMutation.isPending ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        {registroMutation.error && (
          <div className="error-message">
            {registroMutation.error.message}
          </div>
        )}
        
        <div className="auth-switch">
          <p>¿Ya tienes cuenta? 
            <button onClick={onCambiarALogin} className="btn-link">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;