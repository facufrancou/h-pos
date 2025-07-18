// Toast notification utilities

export function showToast(message, type = "info", duration = 5000) {
  // Create and dispatch a custom event to show a toast notification
  const event = new CustomEvent("showToast", {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
}

// Helper functions for specific toast types
export function showSuccessToast(message, duration = 5000) {
  showToast(message, "success", duration);
}

export function showErrorToast(message, duration = 5000) {
  showToast(message, "danger", duration);
}

export function showWarningToast(message, duration = 5000) {
  showToast(message, "warning", duration);
}

export function showInfoToast(message, duration = 5000) {
  showToast(message, "info", duration);
}
