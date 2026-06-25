export default function ProductCard({ product, highlighted = false, reason }) {
  return (
    <article className={`product-card ${highlighted ? "highlighted" : ""}`}>
      <div className="product-topline">
        <span className="chip">{product.category}</span>
        {highlighted && <span className="badge">Top Match</span>}
      </div>

      <h3>{product.name}</h3>
      <p className="brand">{product.brand}</p>

      <div className="product-meta">
        <span className="price">${product.price}</span>
        <span className="rating">★ {product.rating.toFixed(1)}</span>
      </div>

      <p className="description">{product.description}</p>

      {reason && (
        <div className="reason-box">
          <strong>Why recommended</strong>
          <p>{reason}</p>
        </div>
      )}
    </article>
  );
}
