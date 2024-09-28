import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5500/',
  // baseURL: 'https://guisa-backend.vercel.app',
})

export default API
