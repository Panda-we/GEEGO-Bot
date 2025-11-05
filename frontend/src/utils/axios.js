import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://geego-bot.onrender.com/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or 'authToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
