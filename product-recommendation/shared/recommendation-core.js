function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function parseBudget(query) {
  const match = normalizeText(query).match(/(?:under|below|less than|max(?:imum)? of?)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) : null;
}

function scoreProduct(product, query) {
  const text = normalizeText(query);
  let score = 0;

  if (text.includes(normalizeText(product.category))) score += 4;
  if (text.includes(normalizeText(product.brand))) score += 3;

  const budget = parseBudget(query);
  if (budget !== null) {
    if (product.price <= budget) score += 4;
    else score -= 3;
  }

  const keywords = {
    gaming: ["gaming", "gpu", "graphics", "performance"],
    battery: ["battery", "long battery", "endurance"],
    wireless: ["wireless", "bluetooth"],
    noise: ["noise cancellation", "anc", "noise cancelling"],
    affordable: ["cheap", "affordable", "budget", "value"],
    camera: ["camera", "photo", "photos", "photography"],
    fitness: ["fitness", "workout", "health", "running"],
  };

  Object.entries(keywords).forEach(([tag, terms]) => {
    if (terms.some((term) => text.includes(term))) {
      if (tag === "gaming" && /laptop/i.test(product.category)) score += 3;
      if (tag === "battery" && /watch|phone|tablet/i.test(product.category)) score += 2;
      if (tag === "wireless" && /headphones|phones/i.test(product.category)) score += 2;
      if (tag === "noise" && /headphones/i.test(product.category)) score += 3;
      if (tag === "affordable" && product.price <= 500) score += 2;
      if (tag === "camera" && /phone/i.test(product.category)) score += 2;
      if (tag === "fitness" && /watch/i.test(product.category)) score += 2;
    }
  });

  score += product.rating;
  return score;
}

function fallbackRecommendations(query, products) {
  return [...products]
    .filter((product) => {
      const budget = parseBudget(query);
      return budget === null ? true : product.price <= budget;
    })
    .sort((a, b) => scoreProduct(b, query) - scoreProduct(a, query))
    .slice(0, 4)
    .map((product) => ({
      ...product,
      reason: `Selected as a strong catalog match for: ${query}`,
    }));
}

function safeJsonParse(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  const withoutFence = trimmed.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  try {
    return JSON.parse(withoutFence);
  } catch (_error) {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
      } catch (_err) {
        return null;
      }
    }
    return null;
  }
}

async function getOpenRouterRecommendations(query, products) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return null;
  }

  const systemPrompt = [
    "You are a shopping assistant.",
    "You will receive:",
    "1. A list of available products.",
    "2. A customer request.",
    "Recommend ONLY products that exist in the list.",
    "Do not invent products.",
    "Return JSON only.",
    'Format: { "recommendations":[ { "id":1, "reason":"Affordable and fits the requested budget." } ] }',
  ].join(" ");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_REFERER || "http://localhost:5173",
      "X-Title": process.env.OPENROUTER_APP_NAME || "Product Recommendation System",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            request: query,
            products,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  const parsed = safeJsonParse(content);

  if (!parsed || !Array.isArray(parsed.recommendations)) {
    throw new Error("Invalid AI response format");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  return parsed.recommendations
    .map((item) => {
      const product = productMap.get(item.id);
      if (!product) return null;
      return {
        ...product,
        reason: typeof item.reason === "string" && item.reason.trim()
          ? item.reason.trim()
          : "Recommended by AI based on your request.",
      };
    })
    .filter(Boolean);
}

async function recommendProducts(query, products) {
  let recommendedProducts = null;

  try {
    recommendedProducts = await getOpenRouterRecommendations(query, products);
  } catch (error) {
    console.warn("AI recommendation failed, using fallback:", error.message);
  }

  if (!recommendedProducts || recommendedProducts.length === 0) {
    recommendedProducts = fallbackRecommendations(query, products);
  }

  return recommendedProducts;
}

module.exports = {
  fallbackRecommendations,
  getOpenRouterRecommendations,
  normalizeText,
  parseBudget,
  recommendProducts,
  safeJsonParse,
  scoreProduct,
};
