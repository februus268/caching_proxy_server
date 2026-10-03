import { get, set, has } from "./cache.js";

export async function forwardRequest(req, res, origin) {
  const cacheKey = `${req.method} ${req.url}`;
  const shouldCache = req.method === "GET";

  // =========================
  // CACHE HIT
  // =========================

  if (shouldCache && has(cacheKey)) {
    const cachedResponse = get(cacheKey);

    console.log("Cache HIT:", cacheKey);

    res.writeHead(cachedResponse.status, {
      "Content-Type": cachedResponse.contentType,
      "X-Cache": "HIT",
    });

    res.end(cachedResponse.body);
    return;
  }

  // =========================
  // CACHE MISS / BYPASS
  // =========================

  if (shouldCache) {
    console.log("Cache MISS:", cacheKey);
  } else {
    console.log("Cache BYPASS:", cacheKey);
  }

  const targetUrl = new URL(req.url, origin);

  console.log("Forwarding to:", targetUrl.href);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
    });

    const body = await response.text();

    const contentType =
      response.headers.get("content-type") || "text/plain";

    // Chỉ cache GET và response thành công
    if (shouldCache && response.ok) {
      set(cacheKey, {
        status: response.status,
        contentType,
        body,
      });
    }

    res.writeHead(response.status, {
      "Content-Type": contentType,
      "X-Cache": shouldCache ? "MISS" : "BYPASS",
    });

    res.end(body);
  } catch (error) {
    console.error("Proxy error:", error.message);

    res.writeHead(502, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Bad Gateway",
        message: "Could not connect to origin server",
      })
    );
  }
}