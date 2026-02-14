import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (_request, _session, context) => {
  const { id } = await context.params;
  // TODO: List deployments for project, ordered by created_at DESC
  return jsonResponse([]);
});

export const POST = withAuth(async (request, _session, context) => {
  const { id } = await context.params;
  // TODO: Validate body with triggerDeploymentSchema
  // TODO: Create deployment record
  // TODO: Enqueue build
  return errorResponse("Not implemented", 501);
});
