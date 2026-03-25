import type { TestDetailsAnnotation } from "@playwright/test";

export type AnalyticsRiskLevel = "low" | "medium" | "high";

export type AnalyticsMetadata = {
  feature?: string;
  journey?: string;
  page?: string;
  pageObject?: string;
  component?: string;
  risk?: AnalyticsRiskLevel;
  tags?: string[];
};

function normalizeText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function normalizeAnalyticsTags(tags: string[] | undefined): string[] {
  const deduped = new Set<string>();

  for (const tag of tags ?? []) {
    const normalized = tag.trim().replace(/^@+/, "").toLowerCase();
    if (normalized) {
      deduped.add(normalized);
    }
  }

  return [...deduped];
}

export function toAnalyticsAnnotations(metadata: AnalyticsMetadata): TestDetailsAnnotation[] {
  const annotations: TestDetailsAnnotation[] = [];

  const feature = normalizeText(metadata.feature);
  if (feature) {
    annotations.push({ type: "feature", description: feature });
  }

  const journey = normalizeText(metadata.journey);
  if (journey) {
    annotations.push({ type: "journey", description: journey });
  }

  const page = normalizeText(metadata.page);
  if (page) {
    annotations.push({ type: "page", description: page });
  }

  const pageObject = normalizeText(metadata.pageObject);
  if (pageObject) {
    annotations.push({ type: "pageObject", description: pageObject });
  }

  const component = normalizeText(metadata.component);
  if (component) {
    annotations.push({ type: "component", description: component });
  }

  const risk = normalizeText(metadata.risk);
  if (risk) {
    annotations.push({ type: "risk", description: risk });
  }

  for (const tag of normalizeAnalyticsTags(metadata.tags)) {
    annotations.push({ type: "tag", description: tag });
  }

  return annotations;
}
