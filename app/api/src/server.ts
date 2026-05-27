import app from "./index.ts";

Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log("API running on http://localhost:3000");

