import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (_request, _session, context) => {
  const { id } = await context.params;
  // TODO: Get project by ID from database
  return errorResponse("Not implemented", 501);
});

export const PATCH = withAuth(async (request, _session, context) => {
  const { id } = await context.params;
  // TODO: Validate body with updateProjectSchema
  // TODO: Update project in database
  return errorResponse("Not implemented", 501);
});

export const DELETE = withAuth(async (_request, _session, context) => {
  const { id } = await context.params;
  // TODO: Delete project and clean up (stop containers, remove routes)
  return errorResponse("Not implemented", 501);
});
