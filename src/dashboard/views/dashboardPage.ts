import type { DashboardPageData } from "../services/dashboardService";
import type { DashboardCardKey } from "../types";

const cardConfig: Record<DashboardCardKey, { title: string; formatter: (data: DashboardPageData) => string }> = {
  totalRuns: { title: "Total Runs", formatter: (data) => `${data.summary.totalRuns}` },
  passRate: { title: "Pass Rate", formatter: (data) => `${data.summary.passRate.toFixed(1)}%` },
  passedTests: { title: "Passed Tests", formatter: (data) => `${data.summary.passedTests}` },
  failedTests: { title: "Failed Tests", formatter: (data) => `${data.summary.failedTests}` },
  skippedTests: { title: "Skipped Tests", formatter: (data) => `${data.summary.skippedTests}` },
  avgDurationPerTest: {
    title: "Average Duration Per Test",
    formatter: (data) => `${(data.summary.avgDurationPerTestMs / 1000).toFixed(1)}s`,
  },
  avgDurationPerRun: {
    title: "Average Duration Per Run",
    formatter: (data) => `${(data.summary.avgDurationPerRunMs / 1000).toFixed(1)}s`,
  },
  topFailingTest: {
    title: "Top Failing Test",
    formatter: (data) => data.summary.topFailingTest?.title ?? "n/a",
  },
  mostUnstableModule: {
    title: "Most Unstable Module",
    formatter: (data) =>
      data.summary.mostUnstableModule
        ? `${data.summary.mostUnstableModule.module} (${data.summary.mostUnstableModule.instabilityPct.toFixed(1)}%)`
        : "n/a",
  },
};

export function renderDashboardPage(data: DashboardPageData): string {
  const cardsHtml = data.settings.visibleCards
    .map((key) => {
      const card = cardConfig[key];
      if (!card) {
        return "";
      }

      return `<div class="col-12 col-md-6 col-xl-3">
        <div class="card h-100 bg-body-tertiary border-secondary-subtle">
          <div class="card-body">
            <div class="text-secondary small mb-1">${card.title}</div>
            <div class="kpi-value">${card.formatter(data)}</div>
          </div>
        </div>
      </div>`;
    })
    .join("\n");

  const chartPlaceholders = [
    { key: "passFailSkipByRun", title: "Pass/Fail/Skip by Run", id: "passFailSkipByRunChart" },
    { key: "passRateTrend", title: "Pass Rate Trend", id: "passRateTrendChart" },
    { key: "durationTrend", title: "Duration Trend", id: "durationTrendChart" },
    { key: "topFailingTests", title: "Top Failing Tests", id: "topFailingTestsChart" },
  ]
    .filter((chart) => data.settings.visibleCharts.includes(chart.key as never))
    .map(
      (chart) => `<div class="col-12 col-xxl-6">
        <div class="card chart-card bg-body-tertiary border-secondary-subtle">
          <div class="card-header border-secondary-subtle">${chart.title}</div>
          <div class="card-body"><canvas id="${chart.id}"></canvas></div>
        </div>
      </div>`,
    )
    .join("\n");

  const payload = JSON.stringify(data).replace(/</g, "\\u003c");

  return `<section class="container-fluid p-0">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h3 mb-0">Dashboard</h1>
      <span class="text-secondary">History window: last ${data.settings.dashboardHistoryRuns} runs</span>
    </div>

    <div class="row g-3 mb-4">${cardsHtml}</div>

    <div class="row g-3">${chartPlaceholders || '<div class="col-12 text-secondary">No charts are currently enabled in settings.</div>'}</div>
  </section>

  <script>
    const data = ${payload};
    const labels = data.trends.map((point) => new Date(point.startedAt).toLocaleString());

    function makeChart(id, config) {
      const el = document.getElementById(id);
      if (!el) return;
      new Chart(el, config);
    }

    makeChart('passFailSkipByRunChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Passed', data: data.trends.map((r) => r.passedCount), backgroundColor: '#198754' },
          { label: 'Failed', data: data.trends.map((r) => r.failedCount), backgroundColor: '#dc3545' },
          { label: 'Skipped', data: data.trends.map((r) => r.skippedCount), backgroundColor: '#ffc107' },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    makeChart('passRateTrendChart', {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Pass Rate %',
          data: data.trends.map((r) => Number(r.passRate.toFixed(2))),
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13,110,253,0.2)',
          fill: true,
          tension: 0.25,
        }],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    makeChart('durationTrendChart', {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Duration (seconds)',
          data: data.trends.map((r) => Number((r.durationMs / 1000).toFixed(2))),
          borderColor: '#20c997',
          backgroundColor: 'rgba(32,201,151,0.2)',
          fill: true,
          tension: 0.25,
        }],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    makeChart('topFailingTestsChart', {
      type: 'bar',
      data: {
        labels: data.topFailingTests.map((test) => test.testTitle),
        datasets: [{
          label: 'Failures',
          data: data.topFailingTests.map((test) => test.failureCount),
          backgroundColor: '#fd7e14',
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  </script>`;
}
