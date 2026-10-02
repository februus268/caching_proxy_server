import { get, set, has } from "./cache.js";

export async function forwardRequest(req, res, origin) {
  const cacheKey = `${req.method} ${req.url}`;

  // CACHE HIT
  if (has(cacheKey)) {
    const cachedResponse = get(cacheKey);

    console.log("Cache HIT:", cacheKey);

    res.writeHead(cachedResponse.status, {
      "Content-Type": cachedResponse.contentType,
      "X-Cache": "HIT",
    });

    res.end(cachedResponse.body);

    return;
  }

  // CACHE MISS
  console.log("Cache MISS:", cacheKey);

  const targetUrl = new URL(req.url, origin);

  console.log("Forwarding to:", targetUrl.href);

  const response = await fetch(targetUrl);

  const body = await response.text();

  const cachedResponse = {
    status: response.status,
    contentType: response.headers.get("content-type") || "text/plain",
    body: body,
  };

  set(cacheKey, cachedResponse);

  res.writeHead(response.status, {
    "Content-Type": cachedResponse.contentType,
    "X-Cache": "MISS",
  });

  res.end(body);
}
