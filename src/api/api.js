import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`, // backend server
});

// Example API calls:
export const fetchUsers = () => API.get("/users");
export const fetchItems = () => API.get("/items");
export const createOrder = (orderData) => API.post("/orders", orderData);

export default API;
