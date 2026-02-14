import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (_request, _session, context) => {
  const { id, deploymentId } = await context.params;
  // TODO: Get deployment details
  return errorResponse("Not implemented", 501);
});
