import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (request, _session, context) => {
  const { id } = await context.params;
  const scope = request.nextUrl.searchParams.get("scope") ?? "production";
  // TODO: List env vars for project + scope (mask secret values)
  return jsonResponse([]);
});

export const POST = withAuth(async (request, _session, context) => {
  const { id } = await context.params;
  // TODO: Validate body with createEnvVarSchema
  // TODO: Encrypt if is_secret, insert into database
  return errorResponse("Not implemented", 501);
});
