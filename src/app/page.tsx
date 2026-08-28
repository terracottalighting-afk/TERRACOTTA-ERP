import { ErpRouter, type SearchParams } from "./erp-router";

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return <ErpRouter searchParams={searchParams} />;
}
