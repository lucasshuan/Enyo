import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "ares",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
