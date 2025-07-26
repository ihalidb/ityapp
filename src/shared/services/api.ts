import axios from 'axios';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://192.168.1.124:3001'
  : `http://${window.location.hostname}:3001`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 