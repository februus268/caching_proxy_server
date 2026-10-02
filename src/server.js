import http from "node:http";
import { forwardRequest } from "./proxy.js";
export default function startServer(port, origin) {
  const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);
    await forwardRequest(req, res, origin);
  });
  server.listen(port, () => {
    console.log(`Proxy running on port ${port}`);
    console.log(`Origin: ${origin}`);
  });
}
