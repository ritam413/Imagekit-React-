import axios from "axios";

const baseURL = import.meta.env.BACKEND_URL || 
  (import.meta.env.NODE_ENV==="prod"?
    import.meta.env.BACKEND_URL
    :
    "http://localhost:8000/")

console.log(`baseURL in :${import.meta.env.NODE_ENV} `,baseURL)
export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧠 Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚙️ Unified Response Interceptor (handles GET, POST, PUT, DELETE)
api.interceptors.response.use(
  (response) => {
    const method = response.config.method;

    switch (method) {
      case "get":
        console.log("✅ GET success:", response.config.url);
        break;
      case "post":
        console.log("✅ POST success:", response.config.url);
        break;
      case "put":
        console.log("✅ PUT success:", response.config.url);
        break;
      case "delete":
        console.log("✅ DELETE success:", response.config.url);
        break;
      default:
        break;
    }

    return response;
  },
  (error) => {
    const method = error.config?.method;
    const url = error.config?.url;
    const status = error.response?.status;

    if (method) {
      console.error(`❌ ${method.toUpperCase()} request failed:`, url);
      console.error("Error:", error.response?.data || error.message);
    }

    // Handle specific status codes globally
    if (status === 401) {
      console.warn("🚫 Unauthorized Access - redirecting to login...");
      // window.location.href = '/login';
    } else if (status === 500) {
      console.error("💥 Server error - try again later.");
    }

    return Promise.reject(error);
  }
);
