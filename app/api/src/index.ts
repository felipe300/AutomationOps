import { Hono } from "hono";

import { healthRoute } from "./routes/health";
import { usersRoute } from "./routes/users";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "AutomationOps API",
  });
});

app.route("/health", healthRoute);
app.route("/users", usersRoute);

export default app;
