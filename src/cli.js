export function parseArgs() {
  const args = process.argv.slice(2);

  let port = 3000;
  let origin = null;
  let clearCache = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--port") {
      const value = args[++i];

      if (!value || isNaN(Number(value))) {
        throw new Error("--port requires a valid number");
      }

      port = Number(value);

      if (port < 1 || port > 65535) {
        throw new Error("--port must be between 1 and 65535");
      }
    } else if (arg === "--origin") {
      const value = args[++i];

      if (!value) {
        throw new Error("--origin requires a URL");
      }

      try {
        new URL(value);
      } catch {
        throw new Error("--origin must be a valid URL");
      }

      origin = value.replace(/\/$/, "");
    } else if (arg === "--clear-cache") {
      clearCache = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return {
    port,
    origin,
    clearCache,
  };
}
