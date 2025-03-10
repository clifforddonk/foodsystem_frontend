"use client";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
