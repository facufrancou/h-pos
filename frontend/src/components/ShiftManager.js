import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showAviso } from '../utils/printExportUtils';

function ShiftManager() {
  const [activeShift, setActiveShift] = useState(null);
  const [fondoInicial, setFondoInicial] = useState('');
  const [fondoFinal, setFondoFinal] = useState('');
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    fetchActiveShift();
  }, []);

  const fetchActiveShift = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shifts/active');
      setActiveShift(response.data);
    } catch (error) {
      console.error('Error fetching active shift:', error);
    }
  };

  const startShift = async () => {
    console.log('Datos enviados:', { usuario, fondo_inicial: parseFloat(fondoInicial) });
    try {
      const response = await axios.post('http://localhost:5000/api/shifts/start', {
        usuario,
        fondo_inicial: parseFloat(fondoInicial),
      });
      showAviso('Turno iniciado exitosamente');
      setActiveShift(response.data);
      setShowStartModal(false);
      setFondoInicial('');
      setUsuario('');
    } catch (error) {
      console.error('Error al iniciar turno:', error.response?.data || error.message);
      showAviso('Error al iniciar turno');
    }
  };

  const closeShift = async () => {
    try {
      await axios.post('http://localhost:5000/api/shifts/close', {
        fondo_final: parseFloat(fondoFinal),
      });
      showAviso('Turno cerrado exitosamente');
      setActiveShift(null);
      setFondoFinal('');
    } catch (error) {
      console.error('Error closing shift:', error);
      showAviso('Error al cerrar turno');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gestión de Turnos</h1>
      {activeShift ? (
        <div>
          <h3>Turno Activo</h3>
          <p><strong>Usuario:</strong> {activeShift.usuario}</p>
          <p><strong>Fondo Inicial:</strong> ${activeShift.fondo_inicial}</p>
          <div className="mb-3">
            <label>Fondo Final:</label>
            <input
              type="number"
              className="form-control"
              value={fondoFinal}
              onChange={(e) => setFondoFinal(e.target.value)}
            />
          </div>
          <button className="btn btn-danger" onClick={closeShift}>
            Cerrar Turno
          </button>
        </div>
      ) : (
        <div>
          <h3>Iniciar Turno</h3>
          <div className="mb-3">
            <label>Usuario:</label>
            <input
              type="text"
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Fondo Inicial:</label>
            <input
              type="number"
              className="form-control"
              value={fondoInicial}
              onChange={(e) => setFondoInicial(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={startShift}>
            Iniciar Turno
          </button>
        </div>
      )}
    </div>
  );
}

export default ShiftManager;
