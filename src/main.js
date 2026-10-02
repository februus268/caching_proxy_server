import parseArgs from "./cli.js";
import startServer from "./server.js";
const config = parseArgs();
startServer(config.port, config.origin);
