import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7187/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  loginGoogle: (token) => apiClient.post("/auth/login-google", { token }),
  register: (email, password, fullName, phone) =>
    apiClient.post("/auth/register", { email, password, fullName, phone }),
  getCurrentUser: () => apiClient.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
  },
};

export const productService = {
  getAllProducts: (pageIndex = 1, pageSize = 20, searchTerm = "") =>
    apiClient.get("/products", { params: { pageIndex, pageSize, searchTerm } }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  createProduct: (formData) =>
    apiClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

export const categoryService = {
  getAllCategories: (pageIndex = 1, pageSize = 20) =>
    apiClient.get("/categories", { params: { pageIndex, pageSize } }),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  createCategory: (name) => apiClient.post(`/categories/${name}`),
  updateCategory: (id, name) => apiClient.put(`/categories/${id}/${name}`),
};

export const sellerService = {
  registerSeller: (accountId, sellerRequest) =>
    apiClient.post(`/sellers/register/${accountId}`, sellerRequest),
  getSellerById: (id) => apiClient.get(`/sellers/${id}`),
  getSellerByAccountId: (accountId) =>
    apiClient.get(`/sellers/account/${accountId}`),
  getAllSellers: (pageIndex = 1, pageSize = 20) =>
    apiClient.get("/sellers", { params: { pageIndex, pageSize } }),
  approveSeller: (sellerId) => apiClient.put(`/sellers/approve/${sellerId}`),
  deleteSeller: (id) => apiClient.delete(`/sellers/${id}`),
  updateSeller: (sellerRequest) => apiClient.put(`/sellers`, sellerRequest),
};

export const accountService = {
  createAccount: (accountRequest) =>
    apiClient.post("/accounts", accountRequest),
  getAccountById: (id) => apiClient.get(`/accounts/${id}`),
  getAllAccounts: (pageIndex = 1, pageSize = 20) =>
    apiClient.get("/accounts", { params: { pageIndex, pageSize } }),
};

export default apiClient;
