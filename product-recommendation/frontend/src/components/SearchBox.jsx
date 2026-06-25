export default function SearchBox({
  query,
  onQueryChange,
  onSubmit,
  loading,
  category,
  onCategoryChange,
  brand,
  onBrandChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onClear,
}) {
  return (
    <section className="search-panel">
      <form className="search-form" onSubmit={onSubmit}>
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tell us what you're looking for..."
            aria-label="Product search"
          />
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Finding...
              </>
            ) : (
              "Get Recommendations"
            )}
          </button>
        </div>

        <div className="filters">
          <label>
            Category
            <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
              <option value="">All</option>
              <option value="Phones">Phones</option>
              <option value="Laptops">Laptops</option>
              <option value="Headphones">Headphones</option>
              <option value="Smart Watches">Smart Watches</option>
              <option value="Tablets">Tablets</option>
            </select>
          </label>

          <label>
            Brand
            <select value={brand} onChange={(event) => onBrandChange(event.target.value)}>
              <option value="">All</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Google">Google</option>
              <option value="Sony">Sony</option>
              <option value="Dell">Dell</option>
              <option value="Acer">Acer</option>
              <option value="Lenovo">Lenovo</option>
              <option value="Jabra">Jabra</option>
              <option value="Garmin">Garmin</option>
              <option value="OnePlus">OnePlus</option>
            </select>
          </label>

          <label>
            Max Price
            <input
              type="number"
              min="0"
              step="1"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              placeholder="Any"
            />
          </label>

          <label>
            Sort
            <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="rating">Rating</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>

          <button className="secondary-button" type="button" onClick={onClear}>
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
