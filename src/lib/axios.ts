import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-app-key': process.env.APP_AUTH_KEY || '', // internal usage only
  },
  withCredentials: true,
})

export default axiosInstance;