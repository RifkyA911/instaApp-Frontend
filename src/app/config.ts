export const API_URL = process.env.BASE_API_URL || "http://127.0.0.1:8000";
export const token =
	typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

export const isAuthenticated = !!token;
export const userId =
	typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
export const userName =
	typeof window !== "undefined" ? localStorage.getItem("userName") || "" : "";
