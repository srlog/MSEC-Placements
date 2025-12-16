import axios from "axios";

const axiosInstance = axios.create({
	// baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
	baseURL: "http://56.228.32.4:3000/api",
	// baseURL: "http://localhost:3000/api",
	timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			// Add Bearer prefix if not already present
			const bearerToken = token.startsWith("Bearer ")
				? token
				: `Bearer ${token}`;
			config.headers.Authorization = bearerToken;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			// Only redirect if not already on login page
			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
