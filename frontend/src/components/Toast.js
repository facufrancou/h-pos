import React, { useState, useEffect } from "react";

function Toast({ show, message, type = "info", onClose, autoHideDuration = 5000 }) {
  const [isShown, setIsShown] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsShown(true);
      
      // Auto hide after specified duration
      if (autoHideDuration) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDuration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [show, autoHideDuration]);
  
  const handleClose = () => {
    setIsShown(false);
    // Delay the onClose callback to allow animation to complete
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };
  
  if (!show && !isShown) return null;
  
  // Get the correct icon based on the toast type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <i className="fas fa-check-circle"></i>;
      case "warning":
        return <i className="fas fa-exclamation-triangle"></i>;
      case "danger":
        return <i className="fas fa-times-circle"></i>;
      case "info":
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };
  
  // Get the title based on the toast type
  const getTitle = () => {
    switch (type) {
      case "success":
        return "Éxito";
      case "warning":
        return "Advertencia";
      case "danger":
        return "Error";
      case "info":
      default:
        return "Información";
    }
  };
  
  return (
    <div className={`toast ${type} ${isShown ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-header">
        <span className="me-2" style={{ color: getTypeColor(type) }}>
          {getIcon()}
        </span>
        <strong className="me-auto">{getTitle()}</strong>
        <button 
          type="button" 
          className="btn-close" 
          onClick={handleClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
}

// Helper function to get color based on type
function getTypeColor(type) {
  switch (type) {
    case "success":
      return "#16a34a";
    case "warning":
      return "#eab308";
    case "danger":
      return "#e11d48";
    case "info":
    default:
      return "#0ea5e9";
  }
}

export default Toast;
