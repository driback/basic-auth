type ErrorDetails = Record<string, string | number | boolean>;

export class SessionError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: ErrorDetails,
  ) {
    super(message);
    this.name = "SessionError";
  }

  static create(code: keyof typeof ErrorMessages, details?: ErrorDetails) {
    const message = ErrorMessages[code];
    return new SessionError(message, code, details);
  }
}

const ErrorMessages = {
  PERSIST_SESSION_FAILED: "Unable to save session information. Please retry.",
  INVALID_SESSION: "Invalid session detected. Please log in again.",
  SESSION_REVOKED: "This session has been revoked. Please log in again.",
  EXPIRED_SESSION: "Your session has expired. Please log in again.",
  EXPIRED_REFRESH_TOKEN: "Your refresh token has expired. Please log in again.",
  CSRF_TOKEN_MISMATCH: "Security token mismatch. Please refresh the page and try again.",
  SESSION_NOT_FOUND: "Session not found. Please log in again.",
  REFRESH_TOKEN_NOT_FOUND: "Refresh token not found. Please log in again.",
  FAILED_UPDATE_SESSION: "Unable to update session information. Please retry.",
  UPDATE_SESSION_FAILED: "Failed to update session information. Please try again.",
  FAILED_DELETE_SESSION:
    "Failed to delete session. Please try again or contact support if the issue persists.",
  USER_SESSION_NOT_FOUND: "No active sessions found for this user.",
};
