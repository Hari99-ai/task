import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000,
});

export async function fetchRecommendations(query) {
  const response = await client.post("/recommend", { query });
  return response.data;
}
