import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const PATCH = withAuth(async (request, _session, context) => {
  const { id, varId } = await context.params;
  // TODO: Validate body with updateEnvVarSchema
  // TODO: Update env var in database
  return errorResponse("Not implemented", 501);
});

export const DELETE = withAuth(async (_request, _session, context) => {
  const { id, varId } = await context.params;
  // TODO: Delete env var
  return errorResponse("Not implemented", 501);
});
