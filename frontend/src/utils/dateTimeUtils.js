// Utilities for date and time display
export function initializeDateTimeDisplay() {
  const updateDateTime = () => {
    const dateTimeElement = document.getElementById('current-date-time');
    if (dateTimeElement) {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      dateTimeElement.textContent = now.toLocaleDateString('es-ES', options);
    }
  };

  // Update immediately and then every minute
  updateDateTime();
  setInterval(updateDateTime, 60000);
}
