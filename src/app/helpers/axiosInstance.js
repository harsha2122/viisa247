import axios from 'axios'

const Instance = axios.create({
  baseURL: 'http://localhost:5003',
  // baseURL: 'https://visa247.co.in/',
  credentials: 'include',
  withCredentials: true,
})
export default Instance
