import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const POST = withAuth(async (_request, _session, context) => {
  const { id, deploymentId } = await context.params;
  // TODO: Trigger rollback to this deployment
  return errorResponse("Not implemented", 501);
});
