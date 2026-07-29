function getFirstImage(product: Record<string, unknown>) {
  const image = product.image || product.thumbnailImage || product.largeImage;

  if (typeof image === "string") {
    return image;
  }

  return "";
}

function getPrice(product: Record<string, unknown>) {
  const salePrice = product.salePrice;
  const regularPrice = product.regularPrice;
  const price = typeof salePrice === "number" ? salePrice : regularPrice;

  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }

  return "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";
  const apiKey = searchParams.get("apiKey")?.trim() || "";

  if (!query) {
    return Response.json({ error: "Search query is required." }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json({ exact: false, reason: "missing_api_key" });
  }

  const fields = [
    "name",
    "salePrice",
    "regularPrice",
    "url",
    "image",
    "thumbnailImage",
    "largeImage",
    "shortDescription"
  ].join(",");
  const bestBuyUrl = new URL(
    `https://api.bestbuy.com/v1/products(search=${encodeURIComponent(query)})`
  );
  bestBuyUrl.searchParams.set("apiKey", apiKey);
  bestBuyUrl.searchParams.set("format", "json");
  bestBuyUrl.searchParams.set("pageSize", "1");
  bestBuyUrl.searchParams.set("show", fields);

  try {
    const response = await fetch(bestBuyUrl.toString(), {
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      return Response.json({
        exact: false,
        reason: "product_source_error"
      });
    }

    const data = (await response.json()) as {
      products?: Array<Record<string, unknown>>;
    };
    const product = data.products?.[0];

    if (!product) {
      return Response.json({ exact: false, reason: "no_match" });
    }

    return Response.json({
      exact: true,
      store: "Best Buy",
      title: String(product.name || query),
      description: String(product.shortDescription || "Exact product match from Best Buy."),
      price: getPrice(product),
      image: getFirstImage(product),
      url: String(product.url || "")
    });
  } catch {
    return Response.json({ exact: false, reason: "product_source_error" });
  }
}
