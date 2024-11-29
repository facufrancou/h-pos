import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClientSearchModal({ show, onClose, onSelectClient }) {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (show) {
      fetchClients();
    }
  }, [show]);

  useEffect(() => {
    filterClients();
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filterClients = () => {
    if (searchTerm.trim() === '') {
      setFilteredClients([]);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.apellido.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  const handleSelectClient = (client) => {
    onSelectClient(client); // Pasar el cliente seleccionado al modal principal
    onClose(); // Cerrar el modal secundario
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buscar Cliente</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por nombre o apellido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredClients.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>{client.nombre}</td>
                      <td>{client.apellido}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSelectClient(client)}
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se encontraron clientes.</p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientSearchModal;
