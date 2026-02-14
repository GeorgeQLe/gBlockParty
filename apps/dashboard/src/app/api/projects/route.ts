import { NextRequest } from "next/server";
import { withAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

export const GET = withAuth(async (_request, _session) => {
  // TODO: List all projects from database
  return jsonResponse([]);
});

export const POST = withAuth(async (request, _session) => {
  // TODO: Validate body with createProjectSchema
  // TODO: Create project in database
  // TODO: Set up GitHub webhook for repo
  return errorResponse("Not implemented", 501);
});
