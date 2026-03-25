import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { ensureSchemaMigrations, SCHEMA_SQL } from "../../reporting/db/schema";
import type { DashboardSettings } from "../types";

const DEFAULT_SETTINGS: DashboardSettings = {
  dashboardHistoryRuns: 20,
  visibleCards: [
    "totalRuns",
    "passRate",
    "passedTests",
    "failedTests",
    "skippedTests",
    "avgDurationPerTest",
    "avgDurationPerRun",
  ],
  visibleCharts: ["passFailSkipByRun", "passRateTrend", "durationTrend"],
  defaultPageSize: 20,
};

const SETTINGS_KEY = "dashboard";

function cleanupStaleSqliteSidecars(dbPath: string): void {
  const walPath = `${dbPath}-wal`;
  const shmPath = `${dbPath}-shm`;

  if (!fs.existsSync(dbPath)) {
    fs.rmSync(walPath, { force: true });
    fs.rmSync(shmPath, { force: true });
    return;
  }

  const dbStats = fs.statSync(dbPath);
  const walExists = fs.existsSync(walPath);
  const shmExists = fs.existsSync(shmPath);

  if (dbStats.size <= 4096 && shmExists && (!walExists || fs.statSync(walPath).size === 0)) {
    fs.rmSync(walPath, { force: true });
    fs.rmSync(shmPath, { force: true });
  }
}

function parseSettings(value: string | null): DashboardSettings {
  if (!value) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(value) as Partial<DashboardSettings>;
    const parsedVisibleCards = Array.isArray(parsed.visibleCards)
      ? (parsed.visibleCards as string[])
      : DEFAULT_SETTINGS.visibleCards;
    const visibleCards = parsedVisibleCards.flatMap((card) => {
      if (card === "avgDuration") {
        return ["avgDurationPerTest", "avgDurationPerRun"];
      }

      return [card];
    }) as DashboardSettings["visibleCards"];

    return {
      dashboardHistoryRuns:
        typeof parsed.dashboardHistoryRuns === "number" && parsed.dashboardHistoryRuns > 0
          ? parsed.dashboardHistoryRuns
          : DEFAULT_SETTINGS.dashboardHistoryRuns,
      visibleCards,
      visibleCharts: Array.isArray(parsed.visibleCharts)
        ? parsed.visibleCharts
        : DEFAULT_SETTINGS.visibleCharts,
      defaultPageSize:
        typeof parsed.defaultPageSize === "number" && parsed.defaultPageSize > 0
          ? parsed.defaultPageSize
          : DEFAULT_SETTINGS.defaultPageSize,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function withDashboardDb<T>(dbPath: string, fn: (db: DatabaseSync) => T): T {
  const resolvedPath = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  cleanupStaleSqliteSidecars(resolvedPath);
  const db = new DatabaseSync(resolvedPath);
  try {
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(SCHEMA_SQL);
    ensureSchemaMigrations(db);
    return fn(db);
  } finally {
    db.close();
  }
}

export function getDashboardSettings(dbPath: string): DashboardSettings {
  return withDashboardDb(dbPath, (db) => {
    const ensureStmt = db.prepare(`
      INSERT OR IGNORE INTO dashboard_settings (setting_key, setting_value)
      VALUES (?, ?)
    `);
    ensureStmt.run(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));

    const stmt = db.prepare(`
      SELECT setting_value
      FROM dashboard_settings
      WHERE setting_key = ?
    `);

    const row = stmt.get(SETTINGS_KEY) as { setting_value: string } | undefined;
    return parseSettings(row?.setting_value ?? null);
  });
}
