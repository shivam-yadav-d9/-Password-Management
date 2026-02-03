// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://10.0.2.2:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default API;

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.0.2.2:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ AUTO attach token to every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

