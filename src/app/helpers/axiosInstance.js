import axios from 'axios'

const Instance = axios.create({
  baseURL: 'http://localhost:5003',
  // baseURL: 'http://13.233.165.152/',
  credentials: 'include',
  withCredentials: true,
})
export default Instance
