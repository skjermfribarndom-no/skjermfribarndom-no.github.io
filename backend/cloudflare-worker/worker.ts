import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();
app.use("/*", cors());

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwkqoTFYHUt2dkRzgNstENTNhR2K32OU6fSFueU9bi8OR-89QRJr15GCrAvChNOk5i9iw/exec";

app.post("/submit", async (c) => {
  console.log("Submit form");
  const response = await fetch(APPS_SCRIPT_URL, {
    method: c.req.method,
    body: await c.req.text(),
    headers: c.req.raw.headers,
  });
  return c.newResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.get("/health", async (c) => {
  console.log("Health check");
  const response = await fetch(APPS_SCRIPT_URL + "?action=test");
  if (!response.ok) {
    return c.json(
      { status: "FAILED", step: "apps", message: await response.text() },
      503,
    );
  }

  return c.json({
    status: "OK",
    message: "Worker ok (typescript)",
    script: {
      status: response.status,
      message: await response.text(),
    },
    debug: {
      environment: c.env["ENVIRONMENT"],
    },
  });
});

app.onError((error, c) => {
  console.error(`Error while handling ${c.req.url}`, error);
  return c.json(
    {
      status: "ERROR",
      message: error.toString(),
    },
    500,
  );
});

export default app;
