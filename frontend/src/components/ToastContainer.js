import React, { useState, useEffect } from "react";
import Toast from "./Toast";

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for toast events
    const handleToastEvent = (event) => {
      const { message, type, duration } = event.detail;
      addToast(message, type, duration);
    };

    window.addEventListener("showToast", handleToastEvent);
    
    return () => {
      window.removeEventListener("showToast", handleToastEvent);
    };
  }, []);

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          show={true}
          message={toast.message}
          type={toast.type}
          autoHideDuration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
