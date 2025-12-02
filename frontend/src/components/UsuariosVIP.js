import React, { useEffect, useState } from 'react';
import './UsuariosVIP.css';

const UsuariosVIP = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/usuarios-vip/', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Cargando usuarios VIP...</div>;

  return (
    <div className="usuarios-vip">
      <h2>✨ Usuarios VIP</h2>
      <p className="descripcion">Usuarios que han comprado 5 o más álbumes</p>
      
      {usuarios.length === 0 ? (
        <p className="sin-usuarios">No hay usuarios VIP aún</p>
      ) : (
        <div className="tabla-usuarios">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Total Álbumes</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.username}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.total_albums}</td>
                  <td>
                    <span className="badge-vip">✨ VIP</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsuariosVIP;
