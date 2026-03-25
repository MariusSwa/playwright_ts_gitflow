import http from "node:http";
import { parse } from "node:url";
import { handleDashboardRoute, handlePlaceholderRoute } from "./routes/dashboardRoutes";

const PORT = Number(process.env.DASHBOARD_PORT ?? 3030);
const DB_PATH = process.env.RESULTS_DB_PATH ?? "./artifacts/results.db";

const server = http.createServer((req, res) => {
  const pathname = parse(req.url ?? "", true).pathname;

  if (pathname === "/") {
    handleDashboardRoute(DB_PATH, req, res);
    return;
  }

  if (pathname === "/runs") {
    handlePlaceholderRoute("Runs", res);
    return;
  }

  if (pathname === "/failures") {
    handlePlaceholderRoute("Failures", res);
    return;
  }

  if (pathname === "/trends") {
    handlePlaceholderRoute("Trends", res);
    return;
  }

  if (pathname === "/settings") {
    handlePlaceholderRoute("Settings", res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
  console.log(`Using results database: ${DB_PATH}`);
});
