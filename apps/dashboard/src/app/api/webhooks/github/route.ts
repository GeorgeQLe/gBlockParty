import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@gblockparty/core/github";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";
  const event = request.headers.get("x-github-event") ?? "";
  const deliveryId = request.headers.get("x-github-delivery") ?? "";

  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  if (!verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // TODO: Parse payload, call handleWebhook from @gblockparty/core
  // TODO: Deduplicate by delivery ID

  return NextResponse.json({ received: true });
}
