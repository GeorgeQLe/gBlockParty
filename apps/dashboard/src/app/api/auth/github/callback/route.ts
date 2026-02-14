import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // TODO: Exchange code for access token
  // TODO: Fetch user profile from GitHub
  // TODO: Create/update user record
  // TODO: Create session

  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
