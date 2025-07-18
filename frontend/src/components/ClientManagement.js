import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showAviso } from '../utils/printExportUtils';

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: '',
    puntos_acumulados: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Resetear a la primera página cuando se busca
  };

  const handleAdd = () => {
    setForm({
      id: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      email: '',
      puntos_acumulados: '',
    });
    setIsEditing(false);
    setErrorMessage('');
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setForm(client);
    setIsEditing(true);
    setErrorMessage('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`http://localhost:5000/api/clients/${id}`);
        showAviso('Cliente eliminado exitosamente');
        fetchClients(); // Vuelve a cargar la lista de clientes
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        showAviso('Error al eliminar cliente. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!form.nombre || !form.apellido || !form.direccion || !form.telefono || !form.email) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    // Establecer puntos acumulados por defecto
    const formData = {
      ...form,
      puntos_acumulados: form.puntos_acumulados || 0,
    };

    try {
      console.log('Enviando datos al backend:', formData);
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/clients/${formData.id}`, formData);
        showAviso('Cliente actualizado exitosamente');
      } else {
        await axios.post('http://localhost:5000/api/clients', formData);
        showAviso('Cliente agregado exitosamente');
      }
      fetchClients();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving client:', error);
      setErrorMessage('Ocurrió un error al guardar el cliente. Verifique los datos ingresados.');
    }
};

const filteredClients = clients.filter((client) =>
  (client.nombre && client.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
  (client.apellido && client.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
  (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
);

  return (
    <div className="container mt-4">
      <h1>Gestión de Clientes</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-primary mt-3" onClick={handleAdd}>
          Agregar Cliente
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {filteredClients
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nombre}</td>
              <td>{client.apellido}</td>
              <td>{client.direccion}</td>
              <td>{client.telefono}</td>
              <td>{client.email}</td>
              <td>{client.puntos_acumulados}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEdit(client)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(client.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Paginación */}
      {filteredClients.length > 0 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>
            
            {Array.from({ length: Math.ceil(filteredClients.length / itemsPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(filteredClients.length / itemsPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredClients.length / itemsPerPage)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEditing ? 'Editar Cliente' : 'Agregar Cliente'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.apellido}
                      onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.direccion}
                      onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Puntos Acumulados</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.puntos_acumulados}
                      onChange={(e) => setForm({ ...form, puntos_acumulados: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientManagement;
