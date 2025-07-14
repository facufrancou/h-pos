import React, { useEffect, useRef } from "react";

function ModalAviso({ show, mensaje, onClose }) {
  const btnRef = useRef(null);

  useEffect(() => {
    if (show && btnRef.current) {
      btnRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && show) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="mb-0">Resultado de la operación</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
          </div>
          <div className="modal-footer">
            <button ref={btnRef} className="btn btn-primary" onClick={onClose} autoFocus>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAviso;
