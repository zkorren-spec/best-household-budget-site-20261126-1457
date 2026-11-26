// Dev server for The Marlowe Budget Book: serves app/ on localhost.
// Usage: node serve.ts [port]  (default 8123). Standard library only.
import { readFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname, normalize } from "node:path";

const port = Number(process.argv[2] || 8123);
const root = join(process.cwd(), "app");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const path = url === "/" ? "/index.html" : url;
  const file = join(root, normalize(path));
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(port, () => console.log("Marlowe Budget Book on http://localhost:" + port));
