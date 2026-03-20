import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SCHEMA_SQL } from "./schema";

export type TestRunInsert = {
  runUuid: string;
  startedAt: string;
  status: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  durationMs?: number;
  branch?: string;
  commitSha?: string;
  buildNumber?: string;
  environment?: string;
  browser?: string;
  triggeredBy?: string;
};

export type TestRunUpdate = {
  finishedAt: string;
  status: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  durationMs: number;
  browser?: string;
};

export type TestResultInsert = {
  testRunId: number;
  stableTestKey: string;
  testTitle: string;
  suiteName?: string;
  filePath?: string;
  projectName?: string;
  browser?: string;
  status: string;
  retry: number;
  durationMs?: number;
  errorMessage?: string;
  stackTrace?: string;
  failureType?: string;
  moduleName?: string;
  pageName?: string;
};

export type TestArtifactInsert = {
  testResultId: number;
  artifactType: string;
  artifactPath: string;
};

export class ResultsDb {
  private readonly db: DatabaseSync;

  constructor(dbPath: string) {
    const resolvedPath = path.resolve(dbPath);
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    this.db = new DatabaseSync(resolvedPath);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec(SCHEMA_SQL);
  }

  insertTestRun(data: TestRunInsert): number {
    const stmt = this.db.prepare(`
      INSERT INTO test_runs (
        run_uuid, started_at, status, total_tests, passed_count, failed_count, skipped_count,
        duration_ms, branch, commit_sha, build_number, environment, browser, triggered_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.runUuid,
      data.startedAt,
      data.status,
      data.totalTests,
      data.passedCount,
      data.failedCount,
      data.skippedCount,
      data.durationMs ?? null,
      data.branch ?? null,
      data.commitSha ?? null,
      data.buildNumber ?? null,
      data.environment ?? null,
      data.browser ?? null,
      data.triggeredBy ?? null,
    );

    return Number(result.lastInsertRowid);
  }

  updateTestRunByUuid(runUuid: string, data: TestRunUpdate): void {
    const stmt = this.db.prepare(`
      UPDATE test_runs
      SET
        finished_at = ?,
        status = ?,
        total_tests = ?,
        passed_count = ?,
        failed_count = ?,
        skipped_count = ?,
        duration_ms = ?,
        browser = COALESCE(?, browser)
      WHERE run_uuid = ?
    `);

    stmt.run(
      data.finishedAt,
      data.status,
      data.totalTests,
      data.passedCount,
      data.failedCount,
      data.skippedCount,
      data.durationMs,
      data.browser ?? null,
      runUuid,
    );
  }

  insertTestResult(data: TestResultInsert): number {
    const stmt = this.db.prepare(`
      INSERT INTO test_results (
        test_run_id, stable_test_key, test_title, suite_name, file_path, project_name,
        browser, status, retry, duration_ms, error_message, stack_trace,
        failure_type, module_name, page_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.testRunId,
      data.stableTestKey,
      data.testTitle,
      data.suiteName ?? null,
      data.filePath ?? null,
      data.projectName ?? null,
      data.browser ?? null,
      data.status,
      data.retry,
      data.durationMs ?? null,
      data.errorMessage ?? null,
      data.stackTrace ?? null,
      data.failureType ?? null,
      data.moduleName ?? null,
      data.pageName ?? null,
    );

    return Number(result.lastInsertRowid);
  }

  insertTestArtifact(data: TestArtifactInsert): void {
    const stmt = this.db.prepare(`
      INSERT INTO test_artifacts (test_result_id, artifact_type, artifact_path)
      VALUES (?, ?, ?)
    `);

    stmt.run(data.testResultId, data.artifactType, data.artifactPath);
  }

  insertResultWithArtifacts(result: TestResultInsert, artifacts: Omit<TestArtifactInsert, "testResultId">[]): number {
    this.db.exec("BEGIN");
    try {
      const testResultId = this.insertTestResult(result);
      for (const artifact of artifacts) {
        this.insertTestArtifact({
          testResultId,
          artifactType: artifact.artifactType,
          artifactPath: artifact.artifactPath,
        });
      }
      this.db.exec("COMMIT");
      return testResultId;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  close(): void {
    this.db.close();
  }
}
