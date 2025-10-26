import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // backend server
});

// Example API calls:
export const fetchUsers = () => API.get("/users");
export const fetchItems = () => API.get("/items");
export const createOrder = (orderData) => API.post("/orders", orderData);

export default API;
