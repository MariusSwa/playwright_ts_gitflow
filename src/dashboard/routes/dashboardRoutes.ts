import type { IncomingMessage, ServerResponse } from "node:http";
import { getDashboardPageData } from "../services/dashboardService";
import { renderDashboardPage } from "../views/dashboardPage";
import { renderLayout, renderPlaceholderPage } from "../views/layout";

export function handleDashboardRoute(dbPath: string, _req: IncomingMessage, res: ServerResponse): void {
  const data = getDashboardPageData(dbPath);
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(renderLayout("Dashboard", renderDashboardPage(data)));
}

export function handlePlaceholderRoute(title: string, res: ServerResponse): void {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(renderLayout(title, renderPlaceholderPage(title)));
}
