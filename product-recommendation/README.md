# AI Product Recommendation System

Full-stack product recommendation app with a React frontend, Express backend, and OpenRouter-powered AI recommendations.

## Features

- Natural language product search
- OpenRouter Chat Completions API integration
- Catalog-only recommendations with JSON parsing and fallback matching
- Responsive modern UI
- Loading state, empty state, and error handling
- Category, brand, price, and sorting filters
- Product highlighting for matched recommendations

## Project Structure

```text
product-recommendation/
  frontend/
  backend/
  README.md
```

## Product Catalog

The application includes 16 local products across:

- Phones
- Laptops
- Headphones
- Smart Watches
- Tablets

## Installation

> Requires Node.js 18 or newer for the built-in `fetch` used by the backend.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Environment Variables

Create `backend/.env`:

```env
OPENROUTER_API_KEY=YOUR_API_KEY_HERE
PORT=5000
OPENROUTER_MODEL=openai/gpt-4.1-mini
```

Optional:

```env
CORS_ORIGIN=http://localhost:5173
OPENROUTER_REFERER=http://localhost:5173
OPENROUTER_APP_NAME=Product Recommendation System
```

## Running the Backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`.

## Running the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`.

If your backend runs on a different URL, set:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## API

### `POST /recommend`

Request body:

```json
{
  "query": "I want a phone under $500"
}
```

Response:

```json
{
  "query": "I want a phone under $500",
  "products": [
    {
      "id": 2,
      "name": "Samsung Galaxy A54",
      "category": "Phones",
      "price": 449,
      "brand": "Samsung",
      "rating": 4.6,
      "description": "Balanced mid-range phone with bright AMOLED display.",
      "reason": "Fits your requested budget."
    }
  ]
}
```

## Screenshots

Add screenshots here after running the app locally.

- Home page screenshot placeholder
- Recommendation results screenshot placeholder
- Mobile view screenshot placeholder

## Notes

- The OpenRouter API key is only used on the backend.
- If the AI API is unavailable, the backend falls back to deterministic catalog matching.
- The AI prompt instructs the model to recommend only products from the provided list.
