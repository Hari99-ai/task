import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "/api"),
  timeout: 30000,
});

export async function fetchRecommendations(query) {
  const response = await client.post("/recommend", { query });
  return response.data;
}
