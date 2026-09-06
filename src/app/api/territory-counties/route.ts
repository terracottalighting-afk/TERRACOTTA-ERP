import { NextRequest, NextResponse } from "next/server";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim().toUpperCase() ?? "";
  if (!/^[A-Z]{2}$/.test(state)) {
    return NextResponse.json({ error: "A two-letter state code is required." }, { status: 400 });
  }

  const { data, error } = await createSupabaseUntypedAdminClient()
    .from("county_reference")
    .select("county_geoid, county_name")
    .eq("state_code", state)
    .order("county_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ counties: data ?? [] });
}
