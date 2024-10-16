import axios from 'axios'

const Instance = axios.create({
  // baseURL: 'http://localhost:5003',
  baseURL: 'http://13.234.117.32/',
  credentials: 'include',
  withCredentials: true,
})
export default Instance
