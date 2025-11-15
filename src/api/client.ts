import axios from "axios"

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.lightning-rosca.local",
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

