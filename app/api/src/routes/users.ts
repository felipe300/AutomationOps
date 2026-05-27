import { Hono } from "hono";
import { db } from "../db/client";
import { users } from "../db/schema";

export const usersRoute = new Hono();

usersRoute.get("/", async (c) => {
  const data = await db.select().from(users);

  return c.json(data);
});

usersRoute.post("/", async (c) => {
  const body = await c.req.json();

  const inserted = await db
    .insert(users)
    .values({
      name: body.name,
      email: body.email,
    })
    .returning();

  return c.json(inserted[0], 201);
});
