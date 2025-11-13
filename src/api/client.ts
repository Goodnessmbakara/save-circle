import axios from "axios"

export const apiClient = axios.create({
  baseURL: "https://api.lightning-rosca.local",
  timeout: 5_000,
})

apiClient.interceptors.request.use((config) => {
  // Provide a hook for attaching auth headers later.
  return config
})

