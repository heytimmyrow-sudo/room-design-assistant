function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function getMeta(html: string, names: string[]) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i")
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return decodeHtml(match[1]);
      }
    }
  }

  return "";
}

function getElementText(html: string, id: string) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<[^>]+id=["']${escaped}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i");
  const match = html.match(pattern);

  if (!match?.[1]) {
    return "";
  }

  return decodeHtml(match[1].replace(/<[^>]+>/g, " "));
}

function getJsonLdOffer(html: string) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1].trim());
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      const stack = [...entries];

      while (stack.length) {
        const item = stack.shift();

        if (!item || typeof item !== "object") {
          continue;
        }

        const record = item as Record<string, unknown>;
        const offers = record.offers;

        if (offers && typeof offers === "object") {
          const offer = Array.isArray(offers) ? offers[0] : offers;
          const offerRecord = offer as Record<string, unknown>;
          const price = offerRecord.price || offerRecord.lowPrice;
          const currency = offerRecord.priceCurrency;

          if (price) {
            return `${currency === "USD" ? "$" : currency ? `${currency} ` : ""}${String(price)}`;
          }
        }

        Object.values(record).forEach((value) => {
          if (Array.isArray(value)) {
            stack.push(...value);
          } else if (value && typeof value === "object") {
            stack.push(value);
          }
        });
      }
    } catch {
      // Ignore malformed JSON-LD blocks from store pages.
    }
  }

  return "";
}

function getPagePrice(html: string) {
  return (
    getMeta(html, ["product:price:amount", "og:price:amount", "twitter:data1"]) ||
    getElementText(html, "priceblock_ourprice") ||
    getElementText(html, "priceblock_dealprice") ||
    getElementText(html, "priceblock_saleprice") ||
    getElementText(html, "corePrice_feature_div") ||
    getJsonLdOffer(html)
  );
}

function absoluteUrl(value: string, sourceUrl: string) {
  if (!value) {
    return "";
  }

  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return value;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceUrl = searchParams.get("url") || "";

  try {
    const url = new URL(sourceUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return Response.json({ error: "Only http and https links are supported." }, { status: 400 });
    }

    const response = await fetch(url.toString(), {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
      }
    });

    if (!response.ok) {
      return Response.json({
        sourceUrl: url.toString(),
        store: url.hostname.replace(/^www\./, ""),
        blocked: true
      });
    }

    const html = await response.text();
    const title =
      getElementText(html, "productTitle") ||
      getMeta(html, ["og:title", "twitter:title"]) ||
      decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
    const image = absoluteUrl(getMeta(html, ["og:image", "twitter:image", "twitter:image:src"]), url.toString());
    const price = getPagePrice(html);

    return Response.json({
      sourceUrl: url.toString(),
      store: url.hostname.replace(/^www\./, ""),
      title,
      image,
      price,
      blocked: !title && !image && !price
    });
  } catch {
    return Response.json({ error: "The furniture link could not be read." }, { status: 400 });
  }
}
