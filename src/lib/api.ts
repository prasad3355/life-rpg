import { NextResponse } from "next/server";

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  data?: T;
  message?: string;
  [key: string]: unknown;
}

export function apiSuccess<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      ...(message ? { message } : {}),
      ...(typeof data === "object" && data !== null && !Array.isArray(data) ? data : { data }),
    },
    { status }
  );
}

export function apiError(message: string, status = 400, details?: unknown) {
  const body: ApiErrorResponse = { error: message };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

export function unauthorizedError(message = "Unauthorized") {
  return apiError(message, 401);
}

export function forbiddenError(message = "Forbidden: Access denied") {
  return apiError(message, 403);
}

export function notFoundError(message = "Resource not found") {
  return apiError(message, 404);
}

export function validationError(details: unknown, message = "Validation failed") {
  return apiError(message, 400, details);
}

export function serverError(error?: unknown, message = "Internal server error") {
  if (error) {
    console.error("API Server Error:", error);
  }
  return apiError(message, 500);
}
