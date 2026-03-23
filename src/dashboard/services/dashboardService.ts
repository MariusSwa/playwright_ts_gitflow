import type { DashboardSummary, RunTrendPoint, TopFailingTestPoint } from "../types";
import { getDashboardSettings, withDashboardDb } from "../db/dashboardDb";

export type DashboardPageData = {
  settings: ReturnType<typeof getDashboardSettings>;
  summary: DashboardSummary;
  trends: RunTrendPoint[];
  topFailingTests: TopFailingTestPoint[];
};

export function getDashboardPageData(dbPath: string): DashboardPageData {
  const settings = getDashboardSettings(dbPath);
  const history = settings.dashboardHistoryRuns;

  return withDashboardDb(dbPath, (db) => {
    const summaryStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT *
        FROM test_runs
        ORDER BY datetime(started_at) DESC
        LIMIT ?
      )
      SELECT
        COUNT(*) AS total_runs,
        COALESCE(SUM(passed_count), 0) AS passed_tests,
        COALESCE(SUM(failed_count), 0) AS failed_tests,
        COALESCE(SUM(skipped_count), 0) AS skipped_tests,
        COALESCE(AVG(duration_ms), 0) AS avg_duration_per_run_ms,
        COALESCE((
          SELECT AVG(tr.duration_ms)
          FROM test_results tr
          WHERE tr.test_run_id IN (SELECT id FROM recent_runs)
            AND tr.duration_ms IS NOT NULL
        ), 0) AS avg_duration_per_test_ms,
        CASE
          WHEN COALESCE(SUM(total_tests), 0) = 0 THEN 0
          ELSE (100.0 * COALESCE(SUM(passed_count), 0) / SUM(total_tests))
        END AS pass_rate
      FROM recent_runs
    `);

    const summaryRow = summaryStmt.get(history) as {
      total_runs: number;
      passed_tests: number;
      failed_tests: number;
      skipped_tests: number;
      avg_duration_per_run_ms: number;
      avg_duration_per_test_ms: number;
      pass_rate: number;
    };

    const topFailingTestStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT id
        FROM test_runs
        ORDER BY datetime(started_at) DESC
        LIMIT ?
      )
      SELECT
        test_title,
        COUNT(*) AS failure_count
      FROM test_results
      WHERE status = 'failed'
        AND test_run_id IN (SELECT id FROM recent_runs)
      GROUP BY test_title
      ORDER BY failure_count DESC
      LIMIT 1
    `);

    const topFailingTestRow = topFailingTestStmt.get(history) as
      | { test_title: string; failure_count: number }
      | undefined;

    const unstableModuleStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT id
        FROM test_runs
        ORDER BY datetime(started_at) DESC
        LIMIT ?
      )
      SELECT
        COALESCE(module_name, 'unknown') AS module_name,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_count,
        COUNT(*) AS total_count,
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE (100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*))
        END AS instability_pct
      FROM test_results
      WHERE test_run_id IN (SELECT id FROM recent_runs)
      GROUP BY COALESCE(module_name, 'unknown')
      HAVING COUNT(*) > 0
      ORDER BY instability_pct DESC, failed_count DESC
      LIMIT 1
    `);

    const unstableRow = unstableModuleStmt.get(history) as
      | { module_name: string; instability_pct: number }
      | undefined;

    const trendsStmt = db.prepare(`
      SELECT
        run_uuid,
        started_at,
        passed_count,
        failed_count,
        skipped_count,
        COALESCE(duration_ms, 0) AS duration_ms,
        CASE
          WHEN total_tests = 0 THEN 0
          ELSE (100.0 * passed_count / total_tests)
        END AS pass_rate
      FROM test_runs
      ORDER BY datetime(started_at) DESC
      LIMIT ?
    `);

    const trends = (trendsStmt.all(history) as RunTrendPoint[]).reverse();

    const topFailingTestsStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT id
        FROM test_runs
        ORDER BY datetime(started_at) DESC
        LIMIT ?
      )
      SELECT
        test_title,
        COUNT(*) AS failure_count
      FROM test_results
      WHERE status = 'failed'
        AND test_run_id IN (SELECT id FROM recent_runs)
      GROUP BY test_title
      ORDER BY failure_count DESC
      LIMIT 10
    `);

    const topFailingTests = topFailingTestsStmt.all(history) as TopFailingTestPoint[];

    return {
      settings,
      summary: {
        totalRuns: summaryRow.total_runs,
        passRate: Number(summaryRow.pass_rate ?? 0),
        passedTests: summaryRow.passed_tests,
        failedTests: summaryRow.failed_tests,
        skippedTests: summaryRow.skipped_tests,
        avgDurationPerTestMs: Number(summaryRow.avg_duration_per_test_ms ?? 0),
        avgDurationPerRunMs: Number(summaryRow.avg_duration_per_run_ms ?? 0),
        topFailingTest: topFailingTestRow
          ? { title: topFailingTestRow.test_title, failures: topFailingTestRow.failure_count }
          : null,
        mostUnstableModule: unstableRow
          ? { module: unstableRow.module_name, instabilityPct: Number(unstableRow.instability_pct) }
          : null,
      },
      trends,
      topFailingTests,
    };
  });
}
