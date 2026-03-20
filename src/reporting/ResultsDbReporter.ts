import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult,
} from "@playwright/test/reporter";
import { ResultsDb } from "./db/resultsDb";

type ReporterOptions = {
  enabled?: boolean;
  dbPath?: string;
  environment?: string;
  triggeredBy?: string;
};

type FinalizedTestResult = {
  test: TestCase;
  result: TestResult;
};

function asIsoDate(value: Date): string {
  return value.toISOString();
}

function getFailureType(result: TestResult): string | undefined {
  if (!result.error) {
    return undefined;
  }

  if (result.status === "timedOut") {
    return "timeout";
  }

  if (result.error.message?.toLowerCase().includes("expect(")) {
    return "assertion";
  }

  return "runtime";
}

function resolveBrowserName(projectName: string | undefined): string | undefined {
  if (!projectName) {
    return undefined;
  }

  const knownBrowsers = ["chromium", "firefox", "webkit"];
  return knownBrowsers.find((browser) => projectName.includes(browser));
}

function getModuleAndPage(filePath: string | undefined): { moduleName?: string; pageName?: string } {
  if (!filePath) {
    return {};
  }

  const normalized = filePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  const testsIndex = parts.indexOf("tests");
  const fromTests = testsIndex >= 0 ? parts.slice(testsIndex + 1) : parts;

  const fileName = fromTests[fromTests.length - 1] ?? "";
  const pageName = fileName
    .replace(/\.spec\.ts$/, "")
    .replace(/\.setup\.ts$/, "")
    .replace(/\.ts$/, "") || undefined;

  const moduleName = fromTests.length > 1 ? fromTests[0] : undefined;

  return { moduleName, pageName };
}

class ResultsDbReporter implements Reporter {
  private readonly enabled: boolean;
  private readonly dbPath: string;
  private readonly environment: string;
  private readonly triggeredBy: string;
  private readonly runUuid: string;
  private readonly startedAt: Date;

  private db: ResultsDb | null = null;
  private runId: number | null = null;
  private finalizedResults = new Map<string, FinalizedTestResult>();

  constructor(options: ReporterOptions = {}) {
    this.enabled = options.enabled ?? process.env.RESULTS_DB_ENABLED === "true";
    this.dbPath = options.dbPath ?? process.env.RESULTS_DB_PATH ?? "./artifacts/results.db";
    this.environment = options.environment ?? process.env.TEST_ENV ?? process.env.NODE_ENV ?? "local";
    this.triggeredBy = options.triggeredBy ?? process.env.GITHUB_ACTOR ?? process.env.USER ?? "local";

    this.runUuid = randomUUID();
    this.startedAt = new Date();
  }

  onBegin(config: FullConfig, suite: Suite): void {
    if (!this.enabled) {
      return;
    }

    this.db = new ResultsDb(this.dbPath);

    const totalTests = suite.allTests().length;
    const branch = process.env.GIT_BRANCH ?? process.env.BRANCH_NAME;
    const commitSha = process.env.GIT_COMMIT ?? process.env.GITHUB_SHA;
    const buildNumber = process.env.BUILD_NUMBER ?? process.env.GITHUB_RUN_NUMBER;

    const projectNames = config.projects.map((project) => project.name).join(", ");
    this.runId = this.db.insertTestRun({
      runUuid: this.runUuid,
      startedAt: asIsoDate(this.startedAt),
      status: "running",
      totalTests,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      branch,
      commitSha,
      buildNumber,
      environment: this.environment,
      browser: projectNames,
      triggeredBy: this.triggeredBy,
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (!this.enabled || !this.db || !this.runId) {
      return;
    }

    this.finalizedResults.set(test.id, { test, result });
  }

  onEnd(result: FullResult): void {
    if (!this.enabled || !this.db || !this.runId) {
      return;
    }

    let passedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const { test, result: testResult } of this.finalizedResults.values()) {
      const status = testResult.status;
      if (status === "passed") {
        passedCount += 1;
      } else if (status === "skipped") {
        skippedCount += 1;
      } else {
        failedCount += 1;
      }

      const titlePath = test.titlePath();
      const suiteName = titlePath.slice(1, -1).join(" > ") || undefined;
      const stableTestKey = `${test.location.file}::${titlePath.join(" > ")}`;

      const browser = resolveBrowserName(test.parent.project()?.name);
      const filePath = path.relative(process.cwd(), test.location.file);
      const { moduleName, pageName } = getModuleAndPage(filePath);

      this.db.insertResultWithArtifacts(
        {
          testRunId: this.runId,
          stableTestKey,
          testTitle: test.title,
          suiteName,
          filePath,
          projectName: test.parent.project()?.name,
          browser,
          status,
          retry: testResult.retry,
          durationMs: testResult.duration,
          errorMessage: testResult.error?.message,
          stackTrace: testResult.error?.stack,
          failureType: getFailureType(testResult),
          moduleName,
          pageName,
        },
        testResult.attachments
          .filter((attachment) => attachment.path)
          .map((attachment) => ({
            artifactType: attachment.contentType ?? attachment.name,
            artifactPath: attachment.path as string,
          })),
      );
    }

    const finishedAt = new Date();
    this.db.updateTestRunByUuid(this.runUuid, {
      finishedAt: asIsoDate(finishedAt),
      status: result.status,
      totalTests: this.finalizedResults.size,
      passedCount,
      failedCount,
      skippedCount,
      durationMs: finishedAt.getTime() - this.startedAt.getTime(),
    });

    this.db.close();
  }

  onError(error: TestError): void {
    if (!this.enabled || !this.db || !this.runId) {
      return;
    }

    const now = new Date();
    this.db.updateTestRunByUuid(this.runUuid, {
      finishedAt: asIsoDate(now),
      status: "failed",
      totalTests: this.finalizedResults.size,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      durationMs: now.getTime() - this.startedAt.getTime(),
    });

    console.error(`[results-db-reporter] ${error.message}`);
  }
}

export default ResultsDbReporter;
