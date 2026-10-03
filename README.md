# Caching Proxy Server

A lightweight HTTP caching proxy server built with Node.js to demonstrate core backend concepts such as HTTP communication, request forwarding, proxy architecture, in-memory caching, CLI applications, and modular JavaScript development.

## Description

This project implements a simple caching proxy server that sits between a client and an origin server.

Instead of forwarding every request directly to the origin server, the proxy checks its in-memory cache first. If a cached response exists, it returns that response immediately (**Cache HIT**). Otherwise, it forwards the request to the origin server, returns the response to the client, and stores the response in the cache (**Cache MISS**).

The project is designed as a practical backend learning project, focusing on understanding how HTTP requests flow through a server and how caching can reduce repeated requests to an origin server.

## Architecture

```text
                         ┌──────────────┐
                         │    Cache     │
                         │    Map()     │
                         └──────▲───────┘
                                │
                                │ HIT
                                │
┌──────────┐       ┌────────────┴─────────┐
│  Client  │ ────► │   Caching Proxy     │
└──────────┘       │      Server          │
                   └──────────┬───────────┘
                              │
                              │ MISS
                              ▼
                       ┌──────────────┐
                       │    Origin    │
                       │    Server    │
                       └──────────────┘
```

## Features

- HTTP proxy server built with Node.js
- Command-line interface (CLI)
- Configurable proxy port
- Configurable origin server
- HTTP request forwarding
- In-memory response caching
- Cache HIT / MISS detection
- Only caches `GET` requests
- `X-Cache` response header
- Basic error handling
- ES Modules
- Modular project structure

## Technologies

- Node.js
- JavaScript
- HTTP
- ES Modules
- `fetch()`
- `Map`
- npm

## Project Structure

```text
caching-proxy/
│
├── src/
│   ├── main.js
│   ├── cli.js
│   ├── server.js
│   ├── proxy.js
│   └── cache.js
│
├── package.json
└── README.md
```

### `src/main.js`

The application entry point.

Responsibilities:

- Parse CLI arguments
- Handle application-level errors
- Start the proxy server

### `src/cli.js`

Handles command-line arguments such as:

```text
--port
--origin
--clear-cache
```

### `src/server.js`

Creates the Node.js HTTP server and receives incoming client requests.

### `src/proxy.js`

Contains the main proxy logic:

- Build the target URL
- Check the cache
- Forward requests to the origin server
- Receive origin responses
- Store cacheable responses
- Return responses to the client
- Handle origin connection errors

### `src/cache.js`

Provides a simple in-memory cache abstraction using JavaScript `Map`.

```text
get()
set()
has()
clear()
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Enter the project directory:

```bash
cd caching-proxy
```

Install dependencies:

```bash
npm install
```

Register the CLI locally:

```bash
npm link
```

## Usage

Start the proxy server:

```bash
caching-proxy --port 3000 --origin http://dummyjson.com
```

The proxy will run at:

```text
http://localhost:3000
```

The origin server is:

```text
http://dummyjson.com
```

## Testing

After starting the proxy, open:

```text
http://localhost:3000/products
```

### First request — Cache MISS

The first request is not stored in the cache yet.

The terminal should show something similar to:

```text
GET /products
Cache MISS: GET /products
Forwarding to: http://dummyjson.com/products
```

The response contains:

```text
X-Cache: MISS
```

The proxy gets the response from the origin server and stores it in memory.

### Second request — Cache HIT

Refresh the page.

The terminal should show:

```text
GET /products
Cache HIT: GET /products
```

The response contains:

```text
X-Cache: HIT
```

The origin server is not contacted again.

## Request Flow

### Cache MISS

```text
Client
   │
   │ GET /products
   ▼
Proxy
   │
   │ Check cache
   │
   │ MISS
   ▼
Origin Server
   │
   │ HTTP Response
   ▼
Proxy
   │
   ├── Store response in cache
   │
   ▼
Client
```

### Cache HIT

```text
Client
   │
   │ GET /products
   ▼
Proxy
   │
   │ Check cache
   │
   │ HIT
   ▼
Cache
   │
   ▼
Client
```

## CLI Options

### `--port`

Specifies the port on which the proxy server listens.

Example:

```bash
caching-proxy --port 5000 --origin http://dummyjson.com
```

### `--origin`

Specifies the origin server to which requests should be forwarded.

Example:

```bash
caching-proxy --port 3000 --origin http://dummyjson.com
```

### `--clear-cache`

Clears the in-memory cache of the current Node.js process.

```bash
caching-proxy --clear-cache
```

> Note: because the cache is stored in process memory, a separate CLI process cannot clear the cache of an already running proxy process. A production implementation would need inter-process communication or an administrative API for this.

## Cache Key

The cache key is generated from the HTTP method and request URL:

```js
const cacheKey = `${req.method} ${req.url}`;
```

Examples:

```text
GET /products
GET /products/1
GET /users
```

These are treated as different cache entries.

The project only caches `GET` requests because methods such as `POST`, `PUT`, and `DELETE` can modify server-side data and generally should not be cached by this simple implementation.

## Error Handling

If the proxy cannot connect to the origin server, it returns:

```text
502 Bad Gateway
```

Example response:

```json
{
  "error": "Bad Gateway",
  "message": "Could not connect to origin server"
}
```

## Core Concepts

### HTTP

HTTP is the communication protocol used between clients and servers.

A request contains:

```text
Method
URL
Headers
Body
```

A response contains:

```text
Status Code
Headers
Body
```

### Proxy

A proxy acts as an intermediary between a client and another server:

```text
Client → Proxy → Origin Server
```

The proxy can forward requests and responses and, depending on its design, inspect, modify, or cache them.

### Cache

A cache stores previously retrieved data so it can be reused later.

This project uses:

```js
const cache = new Map();
```

The cache is stored in the Node.js process memory.

### `fetch()`

The proxy uses Node.js `fetch()` to send requests to the origin server:

```js
const response = await fetch(targetUrl);
```

### Cache HIT

A requested resource already exists in the cache.

```text
Client → Proxy → Cache → Client
```

The origin server is not contacted.

### Cache MISS

A requested resource does not exist in the cache.

```text
Client → Proxy → Origin → Proxy → Client
                       ↓
                     Cache
```

The proxy retrieves the resource, stores it, and returns it to the client.

## Limitations

This is an educational implementation and intentionally keeps the architecture simple.

Current limitations:

- Cache is stored only in RAM
- Cache is lost when the process stops
- No TTL (Time To Live)
- No persistent storage
- No Redis
- No distributed caching
- Limited HTTP header forwarding
- No advanced cache validation
- `--clear-cache` cannot clear another running process's memory cache

## Future Improvements

Possible improvements include:

- Add TTL-based cache expiration
- Add maximum cache size
- Implement LRU eviction
- Add Redis support
- Forward more HTTP headers
- Support request bodies
- Add cache statistics
- Add automated tests
- Add Docker support
- Add graceful shutdown
- Add an administrative API for cache management
- Add concurrent request deduplication
- Add configurable cache policies

## What I Learned

This project helped me understand the fundamentals of backend development through implementation rather than theory alone.

Key concepts:

- Node.js HTTP servers
- HTTP request/response lifecycle
- CLI applications
- `package.json` and CLI binaries
- ES Modules
- `import` / `export`
- `fetch()`
- Proxy architecture
- In-memory caching
- Cache HIT / MISS
- HTTP status codes
- Error handling
- Modular backend architecture

## Educational Purpose

This project was created as a backend learning project to build a strong understanding of how HTTP requests move through a server, how a proxy works as an intermediary, and how caching can improve repeated requests.

It is intentionally implemented without external caching infrastructure so that the underlying concepts remain visible and easy to understand.

## License

This project is for educational purposes.
