import { startGatewayServer } from "./server";

startGatewayServer().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});