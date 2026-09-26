import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { dateLabel, money, numberFormatter } from "@/lib/formatters";
import { PrimaryShowroomPerformanceReportControls } from "@/components/customers/primary-showroom-performance-report-controls";

type Report = {
  customerName: string;
  recipientEmail: string | null;
  showroomName: string;
  performance: {
    endDate: string;
    itemized: { brandName: string; displayStatus: "current" | "past" | "never"; quantityShipped: number; salesAmount: number; sku: string }[];
    orderAmount: number;
    orderCount: number;
    shippedAmount: number;
    shippedSkuCount: number;
    startDate: string;
  };
};

export async function PrimaryShowroomPerformanceReportPage({ customerId, enrollmentId, loadReport, reportType, reportEndDate, reportStartDate }: { customerId?: string; enrollmentId?: string; loadReport: (customerId: string, enrollmentId: string, startDate?: string, endDate?: string) => Promise<Report>; reportType?: string; reportEndDate?: string; reportStartDate?: string }) {
  if (!customerId || !enrollmentId) return <ModulePlaceholder moduleName="Primary Showroom performance report" />;
  const report = await loadReport(customerId, enrollmentId, reportStartDate, reportEndDate);
  const itemized = reportType === "itemized";
  const reportTitle = itemized ? "Itemized Sales Report" : "Total Sales Report";
  const backHref = `/?module=primary-showroom&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_tab=performance&primary_showroom_performance_from=${report.performance.startDate}&primary_showroom_performance_to=${report.performance.endDate}`;
  return <section className="quote-document-page"><div className="quote-document-controls"><Link className="secondary-action" href={backHref}>Back to Performance</Link><PrimaryShowroomPerformanceReportControls recipientEmail={report.recipientEmail} reportTitle={reportTitle} showroomName={report.showroomName} /></div><article className="quote-document"><header className="quote-document-header"><div><span className="eyebrow">Terracotta Designs and Kanova &amp; Co.</span><h2>{reportTitle}</h2><p>{report.showroomName}</p></div><dl><div><dt>Account</dt><dd>{report.customerName}</dd></div><div><dt>Period</dt><dd>{dateLabel(report.performance.startDate)} - {dateLabel(report.performance.endDate)}</dd></div></dl></header>{itemized ? <section className="document-section"><h3>Sales by SKU</h3>{report.performance.itemized.length ? <table className="document-table"><thead><tr><th>SKU</th><th>Brand</th><th>Pieces Shipped</th><th>Sales Amount</th><th>Display History</th></tr></thead><tbody>{report.performance.itemized.map((item) => <tr key={item.sku}><td>{item.sku}</td><td>{item.brandName}</td><td>{numberFormatter.format(item.quantityShipped)}</td><td>{money(item.salesAmount)}</td><td>{item.displayStatus === "current" ? "Current display" : item.displayStatus === "past" ? "Past display" : "Never a display"}</td></tr>)}</tbody></table> : <p>No regular-order sales were shipped during this period.</p>}</section> : <section className="document-section"><dl className="performance-report-summary"><div><dt>Number of Orders (PO)</dt><dd>{numberFormatter.format(report.performance.orderCount)}</dd></div><div><dt>Order Amount</dt><dd>{money(report.performance.orderAmount)}</dd></div><div><dt>Shipped Amount</dt><dd>{money(report.performance.shippedAmount)}</dd></div><div><dt>Unique SKUs Sold</dt><dd>{numberFormatter.format(report.performance.shippedSkuCount)}</dd></div></dl><h3>Sold SKUs</h3><p>{report.performance.itemized.length ? report.performance.itemized.map((item) => item.sku).join(", ") : "No regular-order sales were shipped during this period."}</p></section>}</article></section>;
}
