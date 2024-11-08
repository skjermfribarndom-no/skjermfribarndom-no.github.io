import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
const app = new Hono();
app.use("/*", cors());

const DEFAULT_APP_SCRIPT_DEPLOYMENT =
  "AKfycbwP3AyILRHAoyfhFOLXglJkVrScX1dHNB6HYJiBo7lQMzkRoRSBPHCzhL3RwTPI6futPQ";

function getAppScriptUrl(variables: any) {
  const deploymentId =
    variables["APP_SCRIPT_DEPLOYMENT_ID"] || DEFAULT_APP_SCRIPT_DEPLOYMENT;
  return `https://script.google.com/macros/s/${deploymentId}/exec`;
}

app.post("/submit", async (c) => {
  console.log("Submit form");
  const response = await fetch(getAppScriptUrl(env(c)), {
    method: c.req.method,
    body: await c.req.text(),
    headers: c.req.raw.headers,
  });
  return c.newResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.get("/confirm", async (c) => {
  console.log("Confirm submission with query " + c.req.query());
  const response = await fetch(
    getAppScriptUrl(env(c)) +
      "?action=confirm&" +
      new URLSearchParams(c.req.query()),
  );
  return c.newResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.get("/health", async (c) => {
  console.log("Health check");
  const response = await fetch(getAppScriptUrl(env(c)) + "?action=test");
  if (!response.ok) {
    return c.json(
      { status: "FAILED", step: "apps", message: await response.text() },
      503,
    );
  }

  return c.json({
    status: "OK",
    message: "Worker ok (typescript)",
    url: getAppScriptUrl(env(c)),
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
