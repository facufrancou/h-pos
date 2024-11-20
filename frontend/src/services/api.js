import axios from 'axios';

const API_URL = 'http://10.10.10.127:5000';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const createSale = async (sale) => {
  const response = await axios.post(`${API_URL}/sales`, { sale });
  return response.data;
};

export const downloadDailyReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/sales/pdf/daily-report`, {
      responseType: 'blob', // Para manejar la descarga de archivos
    });
    const blobURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = blobURL;
    link.setAttribute('download', `Reporte_Diario_${new Date().toLocaleDateString()}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error al descargar el reporte diario:', error);
  }
};

export const addProduct = async (product) => {
  const response = await axios.post(`${API_URL}/products/add`, product);
  return response.data;
};

export const updateProduct = async (product) => {
  const response = await axios.put(`${API_URL}/products/update`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/delete/${id}`);
  return response.data;
};