import type { DashboardSummary, FailTrendPoint, RunTrendPoint, TopFailingTestPoint } from "../types";
import { getDashboardSettings, withDashboardDb } from "../db/dashboardDb";

export type DashboardPageData = {
  settings: ReturnType<typeof getDashboardSettings>;
  summary: DashboardSummary;
  trends: RunTrendPoint[];
  topFailingTests: TopFailingTestPoint[];
  failTrend: FailTrendPoint[];
};

export function getDashboardPageData(dbPath: string): DashboardPageData {
  const settings = getDashboardSettings(dbPath);
  const history = settings.dashboardHistoryRuns;

  return withDashboardDb(dbPath, (db) => {
    const summaryStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT id, duration_ms
        FROM test_runs
        WHERE status != 'running'
        ORDER BY datetime(started_at) DESC
        LIMIT ?
      ),
      recent_results AS (
        SELECT tr.*
        FROM test_results tr
        WHERE tr.test_run_id IN (SELECT id FROM recent_runs)
      )
      SELECT
        (SELECT COUNT(*) FROM recent_runs) AS total_runs,
        COALESCE(SUM(CASE WHEN recent_results.status = 'passed' THEN 1 ELSE 0 END), 0) AS passed_tests,
        COALESCE(SUM(CASE WHEN recent_results.status = 'failed' THEN 1 ELSE 0 END), 0) AS failed_tests,
        COALESCE(SUM(CASE WHEN recent_results.status = 'skipped' THEN 1 ELSE 0 END), 0) AS skipped_tests,
        COALESCE((SELECT AVG(duration_ms) FROM recent_runs WHERE duration_ms IS NOT NULL), 0) AS avg_duration_per_run_ms,
        COALESCE(AVG(recent_results.duration_ms), 0) AS avg_duration_per_test_ms,
        CASE
          WHEN COUNT(recent_results.id) = 0 THEN 0
          ELSE (100.0 * SUM(CASE WHEN recent_results.status = 'passed' THEN 1 ELSE 0 END) / COUNT(recent_results.id))
        END AS pass_rate
      FROM recent_results
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
        WHERE status != 'running'
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
        WHERE status != 'running'
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
      WHERE status != 'running'
      ORDER BY datetime(started_at) DESC
      LIMIT ?
    `);

    const trends = (trendsStmt.all(history) as RunTrendPoint[]).reverse();

    const topFailingTestsStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT id
        FROM test_runs
        WHERE status != 'running'
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

    const failTrendStmt = db.prepare(`
      WITH recent_runs AS (
        SELECT id
        FROM test_runs
        WHERE status != 'running'
        ORDER BY datetime(started_at) DESC
        LIMIT ?
      )
      SELECT
        COALESCE(page_name, 'unknown') AS page_name,
        test_title,
        COUNT(*) AS failure_count
      FROM test_results
      WHERE status = 'failed'
        AND test_run_id IN (SELECT id FROM recent_runs)
      GROUP BY COALESCE(page_name, 'unknown'), test_title
      ORDER BY failure_count DESC, page_name ASC, test_title ASC
      LIMIT 10
    `);

    const failTrend = (failTrendStmt.all(history) as Array<{
      page_name: string;
      test_title: string;
      failure_count: number;
    }>).map((row) => ({
      pageName: row.page_name,
      testTitle: row.test_title,
      failureCount: row.failure_count,
    }));

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
      failTrend,
    };
  });
}
