import { NextRequest, NextResponse } from "next/server";
import { getSession, type Session } from "./auth";

export function jsonResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  message: string,
  status = 400,
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

type AuthenticatedHandler = (
  request: NextRequest,
  session: Session,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
  ): Promise<NextResponse> => {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }
    return handler(request, session, context);
  };
}
