import axios from "axios";

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
