// axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://geego-bot.onrender.com/api',
  withCredentials: true,
})

export default instance
