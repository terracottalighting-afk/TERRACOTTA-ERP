import Link from "next/link";

import { label } from "@/lib/formatters";

type StatusBadgeTone = "good" | "neutral" | "primary" | "warn" | "danger";

export function StatusBadge({
  tone = "neutral",
  value,
}: {
  tone?: StatusBadgeTone;
  value: string;
}) {
  return (
    <span className={`status-badge status-badge--${tone}`}>{label(value)}</span>
  );
}

export function Metric({
  labelText,
  value,
}: {
  labelText: string;
  value: string;
}) {
  return (
    <div className="metric">
      <span>{labelText}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function MetricLink({
  href,
  labelText,
  value,
}: {
  href: string;
  labelText: string;
  value: string;
}) {
  return (
    <div className="metric">
      <span>{labelText}</span>
      <Link className="metric-link" href={href}>
        <strong>{value}</strong>
      </Link>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}

export function ModulePlaceholder({ moduleName }: { moduleName: string }) {
  return (
    <section className="dashboard-panel">
      <div className="placeholder-panel">
        <span className="eyebrow">Phase 1 UI Buildout</span>
        <h2>{moduleName}</h2>
        <p>
          This module is already represented in the database design, but its
          working screen has not been built yet. The first active vertical slice
          is Customer Search / Account Dashboard.
        </p>
        <Link className="secondary-action" href="/">
          Back to Customer Search
        </Link>
      </div>
    </section>
  );
}
