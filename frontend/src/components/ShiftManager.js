import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShiftManager() {
    const [activeShift, setActiveShift] = useState(null);
    const [fondoInicial, setFondoInicial] = useState('');
    const [usuario, setUsuario] = useState('');
    const [fondoFinal, setFondoFinal] = useState('');

    useEffect(() => {
        fetchActiveShift();
    }, []);

    const fetchActiveShift = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shifts/active');
            setActiveShift(response.data);
        } catch (error) {
            console.error('No hay un turno activo', error);
        }
    };

    const startShift = async () => {
        try {
            await axios.post('http://localhost:5000/api/shifts/start', {
                usuario,
                fondo_inicial: parseFloat(fondoInicial),
            });
            alert('Turno iniciado');
            fetchActiveShift();
        } catch (error) {
            console.error('Error al iniciar turno', error);
            alert('Error al iniciar turno');
        }
    };

    const closeShift = async () => {
        try {
            await axios.post('http://localhost:5000/api/shifts/close', {
                fondo_final: parseFloat(fondoFinal),
            });
            alert('Turno cerrado');
            setActiveShift(null);
        } catch (error) {
            console.error('Error al cerrar turno', error);
            alert('Error al cerrar turno');
        }
    };

    return (
        <div>
            {activeShift ? (
                <div>
                    <h3>Turno Activo</h3>
                    <p>Usuario: {activeShift.usuario}</p>
                    <p>Fondo Inicial: ${activeShift.fondo_inicial}</p>
                    <input
                        type="number"
                        placeholder="Fondo Final"
                        value={fondoFinal}
                        onChange={(e) => setFondoFinal(e.target.value)}
                    />
                    <button onClick={closeShift}>Cerrar Turno</button>
                </div>
            ) : (
                <div>
                    <h3>Iniciar Turno</h3>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Fondo Inicial"
                        value={fondoInicial}
                        onChange={(e) => setFondoInicial(e.target.value)}
                    />
                    <button onClick={startShift}>Iniciar Turno</button>
                </div>
            )}
        </div>
    );
}

export default ShiftManager;
