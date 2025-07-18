import React, { useEffect, useRef, useState } from "react";

function ModalAviso({ show, mensaje, onClose, type = "info" }) {
  const btnRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      
      if (btnRef.current) {
        btnRef.current.focus();
      }
    } else {
      setIsAnimating(false);
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
  
  // Get icon based on message type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <i className="fas fa-check-circle fa-2x text-success me-3"></i>;
      case "warning":
        return <i className="fas fa-exclamation-triangle fa-2x text-warning me-3"></i>;
      case "danger":
      case "error":
        return <i className="fas fa-times-circle fa-2x text-danger me-3"></i>;
      case "info":
      default:
        return <i className="fas fa-info-circle fa-2x text-info me-3"></i>;
    }
  };

  // Get title based on type
  const getTitle = () => {
    switch (type) {
      case "success":
        return "Operación exitosa";
      case "warning":
        return "Advertencia";
      case "danger":
      case "error":
        return "Error";
      case "info":
      default:
        return "Información";
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className={`modal-dialog animate-${isAnimating ? 'slideInUp' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title mb-0">{getTitle()}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex align-items-center">
              {getIcon()}
              <p className="m-0">{mensaje}</p>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              ref={btnRef} 
              className="btn btn-primary" 
              onClick={onClose} 
              autoFocus
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAviso;
