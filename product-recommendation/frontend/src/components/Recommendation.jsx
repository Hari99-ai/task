import ProductCard from "./ProductCard";

export default function Recommendation({ recommendations, query }) {
  if (!recommendations.length) {
    return (
      <section className="empty-state">
        <h2>No recommendations yet</h2>
        <p>
          Enter a natural language request such as "I want a phone under $500" to get AI-generated recommendations.
        </p>
      </section>
    );
  }

  return (
    <section className="recommendation-section">
      <div className="section-header">
        <div>
          <h2>AI Recommendations</h2>
          <p>Results for: {query}</p>
        </div>
      </div>

      <div className="grid recommendation-grid">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} highlighted reason={product.reason} />
        ))}
      </div>
    </section>
  );
}
