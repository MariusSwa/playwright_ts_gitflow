export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS test_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_uuid TEXT NOT NULL UNIQUE,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  total_tests INTEGER NOT NULL DEFAULT 0,
  passed_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  branch TEXT,
  commit_sha TEXT,
  build_number TEXT,
  environment TEXT,
  browser TEXT,
  triggered_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_test_runs_started_at ON test_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(status);
CREATE INDEX IF NOT EXISTS idx_test_runs_branch ON test_runs(branch);

CREATE TABLE IF NOT EXISTS test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_run_id INTEGER NOT NULL,
  stable_test_key TEXT NOT NULL,
  test_title TEXT NOT NULL,
  suite_name TEXT,
  file_path TEXT,
  project_name TEXT,
  browser TEXT,
  status TEXT NOT NULL,
  retry INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  error_message TEXT,
  stack_trace TEXT,
  failure_type TEXT,
  module_name TEXT,
  page_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (test_run_id) REFERENCES test_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_test_results_test_run_id ON test_results(test_run_id);
CREATE INDEX IF NOT EXISTS idx_test_results_stable_test_key ON test_results(stable_test_key);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);
CREATE INDEX IF NOT EXISTS idx_test_results_project_name ON test_results(project_name);

CREATE TABLE IF NOT EXISTS test_artifacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_result_id INTEGER NOT NULL,
  artifact_type TEXT NOT NULL,
  artifact_path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (test_result_id) REFERENCES test_results(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_test_artifacts_test_result_id ON test_artifacts(test_result_id);
CREATE INDEX IF NOT EXISTS idx_test_artifacts_artifact_type ON test_artifacts(artifact_type);

CREATE TABLE IF NOT EXISTS linked_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_result_id INTEGER NOT NULL,
  issue_key TEXT NOT NULL,
  issue_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (test_result_id) REFERENCES test_results(id) ON DELETE CASCADE
);
`;
