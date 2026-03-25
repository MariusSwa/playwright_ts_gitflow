export type DashboardCardKey =
  | "totalRuns"
  | "passRate"
  | "passedTests"
  | "failedTests"
  | "skippedTests"
  | "avgDurationPerTest"
  | "avgDurationPerRun"
  | "topFailingTest"
  | "mostUnstableModule";

export type DashboardChartKey =
  | "passFailSkipByRun"
  | "passRateTrend"
  | "durationTrend"
  | "topFailingTests";

export type DashboardSettings = {
  dashboardHistoryRuns: number;
  visibleCards: DashboardCardKey[];
  visibleCharts: DashboardChartKey[];
  defaultPageSize: number;
};

export type DashboardSummary = {
  totalRuns: number;
  passRate: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  avgDurationPerTestMs: number;
  avgDurationPerRunMs: number;
  topFailingTest: { title: string; failures: number } | null;
  mostUnstableModule: { module: string; instabilityPct: number } | null;
};

export type RunTrendPoint = {
  runUuid: string;
  startedAt: string;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  durationMs: number;
  passRate: number;
};

export type TopFailingTestPoint = {
  testTitle: string;
  failureCount: number;
};

export type FailTrendPoint = {
  pageName: string;
  testTitle: string;
  failureCount: number;
};
