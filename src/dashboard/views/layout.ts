export function renderLayout(title: string, content: string): string {
  return `<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
  <style>
    body { min-height: 100vh; }
    .sidebar { width: 240px; }
    .content-area { min-height: calc(100vh - 56px); }
    .kpi-value { font-size: 1.7rem; font-weight: 700; }
    .chart-card { min-height: 360px; }
  </style>
</head>
<body>
  <nav class="navbar navbar-expand-lg border-bottom border-secondary-subtle bg-body-tertiary">
    <div class="container-fluid">
      <span class="navbar-brand fw-semibold">Playwright Results Dashboard</span>
      <span class="text-secondary small">Local analytics preview</span>
    </div>
  </nav>
  <div class="d-flex content-area">
    <aside class="sidebar border-end border-secondary-subtle p-3">
      <div class="list-group list-group-flush">
        <a class="list-group-item list-group-item-action active" href="/">Dashboard</a>
        <a class="list-group-item list-group-item-action" href="/runs">Runs</a>
        <a class="list-group-item list-group-item-action" href="/failures">Failures</a>
        <a class="list-group-item list-group-item-action" href="/trends">Trends</a>
        <a class="list-group-item list-group-item-action" href="/settings">Settings</a>
      </div>
    </aside>
    <main class="flex-grow-1 p-4">${content}</main>
  </div>
</body>
</html>`;
}

export function renderPlaceholderPage(title: string): string {
  return `<section class="container-fluid p-0">
    <h1 class="h3 mb-3">${title}</h1>
    <div class="card bg-body-tertiary border-secondary-subtle">
      <div class="card-body text-secondary">
        ${title} is reserved for upcoming dashboard expansion.
      </div>
    </div>
  </section>`;
}
