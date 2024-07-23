import { Client } from "./core/Client";

async function login(): Promise<void> {
  const client = new Client();
  await client.login();
}

login().catch((error: Error): void => {
  console.error(`Start Error: ${error.stack}`);
});
