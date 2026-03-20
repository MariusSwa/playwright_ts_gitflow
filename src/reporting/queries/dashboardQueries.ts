import { DatabaseSync } from "node:sqlite";

export type RunOverview = {
  run_uuid: string;
  started_at: string;
  status: string;
  total_tests: number;
  passed_count: number;
  failed_count: number;
  skipped_count: number;
  duration_ms: number;
  branch: string | null;
  commit_sha: string | null;
};

export function withResultsDb<T>(dbPath: string, fn: (db: DatabaseSync) => T): T {
  const db = new DatabaseSync(dbPath, { open: true, readOnly: true });
  try {
    return fn(db);
  } finally {
    db.close();
  }
}

export function getRecentRuns(dbPath: string, limit = 20): RunOverview[] {
  return withResultsDb(dbPath, (db) => {
    const stmt = db.prepare(`
      SELECT run_uuid, started_at, status, total_tests, passed_count, failed_count,
             skipped_count, duration_ms, branch, commit_sha
      FROM test_runs
      ORDER BY datetime(started_at) DESC
      LIMIT ?
    `);

    return stmt.all(limit) as RunOverview[];
  });
}

export function getFailureRateByTest(dbPath: string, limit = 50) {
  return withResultsDb(dbPath, (db) => {
    const stmt = db.prepare(`
      SELECT
        stable_test_key,
        MAX(test_title) AS test_title,
        COUNT(*) AS total_executions,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failure_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS failure_rate_pct
      FROM test_results
      GROUP BY stable_test_key
      HAVING COUNT(*) >= 1
      ORDER BY failure_rate_pct DESC, total_executions DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  });
}

export function getFlakyCandidates(dbPath: string, minRuns = 5, limit = 25) {
  return withResultsDb(dbPath, (db) => {
    const stmt = db.prepare(`
      SELECT
        stable_test_key,
        MAX(test_title) AS test_title,
        COUNT(*) AS total_runs,
        SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) AS pass_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS fail_count
      FROM test_results
      GROUP BY stable_test_key
      HAVING COUNT(*) >= ?
         AND SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) > 0
         AND SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) > 0
      ORDER BY total_runs DESC, fail_count DESC
      LIMIT ?
    `);

    return stmt.all(minRuns, limit);
  });
}

export function getSlowestTests(dbPath: string, limit = 25) {
  return withResultsDb(dbPath, (db) => {
    const stmt = db.prepare(`
      SELECT
        stable_test_key,
        MAX(test_title) AS test_title,
        ROUND(AVG(duration_ms), 2) AS avg_duration_ms,
        MAX(duration_ms) AS max_duration_ms,
        COUNT(*) AS total_runs
      FROM test_results
      WHERE duration_ms IS NOT NULL
      GROUP BY stable_test_key
      ORDER BY avg_duration_ms DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  });
}

export function getFailuresByModule(dbPath: string, limit = 20) {
  return withResultsDb(dbPath, (db) => {
    const stmt = db.prepare(`
      SELECT
        COALESCE(module_name, 'unknown') AS module_name,
        COUNT(*) AS total_failures
      FROM test_results
      WHERE status = 'failed'
      GROUP BY COALESCE(module_name, 'unknown')
      ORDER BY total_failures DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  });
}
