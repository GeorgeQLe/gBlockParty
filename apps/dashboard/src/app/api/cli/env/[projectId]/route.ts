import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (_request, _session, context) => {
  const { projectId } = await context.params;
  // TODO: Download env vars for CLI (env pull)
  return jsonResponse({});
});

export const POST = withAuth(async (request, _session, context) => {
  const { projectId } = await context.params;
  // TODO: Upload env vars from CLI (env push)
  return errorResponse("Not implemented", 501);
});
