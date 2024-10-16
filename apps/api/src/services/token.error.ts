type ErrorDetails = Record<string, string | number | boolean>;

export class TokenError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: ErrorDetails,
  ) {
    super(message);
    this.name = "TokenError";
  }

  static create(code: keyof typeof ErrorMessages, details?: ErrorDetails) {
    const message = ErrorMessages[code];
    return new TokenError(message, code, details);
  }
}

const ErrorMessages = {
  MISSING_REFRESH_TOKEN: "Refresh token not found. Please log in again.",
  FAILED_CREATE_REFRESH_TOKEN: "Failed to create a new refresh token. Please try again.",
  USER_CREDENTIAL_NOT_FOUND: "No credential found from this user. Please check and try again.",
  FAILED_CREATE_RESET_TOKEN: "Failed to create a reset token. Please try again.",
};
