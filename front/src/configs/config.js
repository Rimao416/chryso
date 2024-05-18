import axios from "axios";
export const API = axios.create({ baseURL: "http://localhost:5000" });
API.defaults.withCredentials = true;
export const assetsURL = "http://localhost:5000/";
