import axios from 'axios'

const httpRequest = axios.create({
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    baseURL: "/api", // Usar ruta relativa para que funcione con el proxy
    withCredentials: true,
})

export default httpRequest