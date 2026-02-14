import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (_request, _session, context) => {
  const { id } = await context.params;
  // TODO: Get managed database info for project
  return jsonResponse(null);
});

export const POST = withAuth(async (_request, _session, context) => {
  const { id } = await context.params;
  // TODO: Create managed database (app_{slug}), set DATABASE_URL env var
  return errorResponse("Not implemented", 501);
});

export const DELETE = withAuth(async (_request, _session, context) => {
  const { id } = await context.params;
  // TODO: Drop managed database, remove env var
  return errorResponse("Not implemented", 501);
});
