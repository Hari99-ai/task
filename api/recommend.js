const products = require("../product-recommendation/backend/products");
const { recommendProducts } = require("../product-recommendation/shared/recommendation-core");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST is supported.",
    });
  }

  try {
    const { query } = req.body || {};
    const trimmedQuery = String(query || "").trim();

    if (!trimmedQuery) {
      return res.status(400).json({
        error: "Validation error",
        message: "Query is required.",
      });
    }

    const recommendedProducts = await recommendProducts(trimmedQuery, products);

    res.status(200).json({
      query: trimmedQuery,
      products: recommendedProducts,
    });
  } catch (error) {
    console.error("Recommendation API error:", error);
    res.status(500).json({
      error: "Recommendation failed",
      message: "Unable to generate recommendations at the moment.",
    });
  }
};
