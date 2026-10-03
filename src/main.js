#!/usr/bin/env node

import { parseArgs } from "./cli.js";
import { startServer } from "./server.js";
import { clear } from "./cache.js";

try {
  const config = parseArgs();

  if (config.clearCache) {
    clear();
    console.log("Cache cleared.");
    process.exit(0);
  }

  if (!config.origin) {
    throw new Error(
      "--origin is required. Example: --origin http://dummyjson.com"
    );
  }

  startServer(config.port, config.origin);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}