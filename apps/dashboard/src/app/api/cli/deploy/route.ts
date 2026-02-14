import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const POST = withAuth(async (request, _session) => {
  // TODO: Trigger deployment from CLI
  // Body: { projectId, branch?, commitSha? }
  return errorResponse("Not implemented", 501);
});
