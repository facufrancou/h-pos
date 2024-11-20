import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const createSale = async (sale) => {
  const response = await axios.post(`${API_URL}/sales`, { sale });
  return response.data;
};

export const downloadDailyReport = async () => {
  const response = await axios.get(`${API_URL}/sales/daily-report`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'reporte_diario.pdf');
  document.body.appendChild(link);
  link.click();
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