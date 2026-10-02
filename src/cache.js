const cache = new Map();

export function get(key) {
  return cache.get(key);
}

export function set(key, value) {
  cache.set(key, value);
}

export function has(key) {
  return cache.has(key);
}

export function clear() {
  cache.clear();
}

export function size() {
  return cache.size;
}
