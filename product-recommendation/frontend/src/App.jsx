import { useState } from "react";
import SearchBox from "./components/SearchBox";
import ProductCard from "./components/ProductCard";
import Recommendation from "./components/Recommendation";
import { fetchRecommendations } from "./api";
import { products } from "./products";

function scoreForDisplay(product, query) {
  const text = String(query || "").toLowerCase();
  let score = product.rating;
  if (text.includes(product.category.toLowerCase())) score += 3;
  if (text.includes(product.brand.toLowerCase())) score += 2;
  if (text.includes("under") || text.includes("budget")) score += product.price <= 500 ? 2 : 0;
  if (text.includes("gaming") && product.category === "Laptops") score += 2;
  if (text.includes("noise") && product.category === "Headphones") score += 2;
  if (text.includes("battery") && product.category === "Smart Watches") score += 2;
  return score;
}

export default function App() {
  const [query, setQuery] = useState("Suggest a gaming laptop under $1000.");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setError("Please enter a product request.");
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchRecommendations(trimmed);
      setRecommendations(Array.isArray(data.products) ? data.products : []);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to fetch recommendations.";
      setError(message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setCategory("");
    setBrand("");
    setMaxPrice("");
    setSortBy("recommended");
  };

  const filteredProducts = products
    .filter((product) => (category ? product.category === category : true))
    .filter((product) => (brand ? product.brand === brand : true))
    .filter((product) => (maxPrice ? product.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return scoreForDisplay(b, query) - scoreForDisplay(a, query);
    });

  const recommendedIds = new Set(recommendations.map((product) => product.id));

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">OpenRouter powered retail assistant</p>
          <h1>AI Product Recommendation System</h1>
          <p className="hero-text">
            Describe what you need in plain English and get recommendations from a fixed catalog with reasons.
          </p>
        </div>

        <div className={`status-pill ${loading ? "active" : ""}`}>
          {loading ? "Analyzing request..." : "Ready"}
        </div>
      </header>

      <SearchBox
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        loading={loading}
        category={category}
        onCategoryChange={setCategory}
        brand={brand}
        onBrandChange={setBrand}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onClear={resetFilters}
      />

      {error && <div className="error-banner">{error}</div>}

      <Recommendation recommendations={recommendations} query={query.trim()} />

      <section className="catalog-section">
        <div className="section-header">
          <div>
            <h2>Catalog</h2>
            <p>
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} visible
            </p>
          </div>
        </div>

        <div className="grid catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              highlighted={recommendedIds.has(product.id)}
              reason={recommendedIds.has(product.id) ? "Returned by the AI recommendation engine." : undefined}
            />
          ))}
        </div>

        {!filteredProducts.length && (
          <div className="empty-state compact">
            <h2>No products match the current filters</h2>
            <p>Reset filters to see the full catalog again.</p>
          </div>
        )}
      </section>
    </main>
  );
}
