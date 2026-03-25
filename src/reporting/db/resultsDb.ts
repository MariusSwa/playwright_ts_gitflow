import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { AnalyticsRiskLevel } from "../analyticsMeta";
import { normalizeAnalyticsTags } from "../analyticsMeta";
import { ensureSchemaMigrations, SCHEMA_SQL } from "./schema";

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
  featureName?: string;
  journeyName?: string;
  pageObjectName?: string;
  componentName?: string;
  riskLevel?: AnalyticsRiskLevel;
  tags?: string[];
};

export type TestArtifactInsert = {
  testResultId: number;
  artifactType: string;
  artifactPath: string;
};

export type TestResultTagInsert = {
  testResultId: number;
  tag: string;
};

export class ResultsDb {
  private readonly db: DatabaseSync;

  constructor(dbPath: string) {
    const resolvedPath = path.resolve(dbPath);
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    cleanupStaleSqliteSidecars(resolvedPath);
    this.db = new DatabaseSync(resolvedPath);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec(SCHEMA_SQL);
    ensureSchemaMigrations(this.db);
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
        failure_type, module_name, page_name, feature_name, journey_name,
        page_object_name, component_name, risk_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.featureName ?? null,
      data.journeyName ?? null,
      data.pageObjectName ?? null,
      data.componentName ?? null,
      data.riskLevel ?? null,
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

  insertTestResultTag(data: TestResultTagInsert): void {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO test_result_tags (test_result_id, tag)
      VALUES (?, ?)
    `);

    stmt.run(data.testResultId, data.tag);
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
      for (const tag of normalizeAnalyticsTags(result.tags)) {
        this.insertTestResultTag({ testResultId, tag });
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
