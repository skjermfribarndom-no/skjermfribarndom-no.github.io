import * as readline from "node:readline";

const deployments = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  line = line.trim();
  const match = line.match(/-\s+(\S+)\s+@(\d+)/);
  if (match) {
    deployments.push({
      deploymentId: match[1],
      version: parseInt(match[2]),
    });
  }
});

rl.on("close", () => {
  console.log(
    `APP_SCRIPT_DEPLOYMENT_ID=${deployments.toSorted((a, b) => b.version - a.version)[0].deploymentId}`,
  );
});
