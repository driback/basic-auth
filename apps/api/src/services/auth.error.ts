const ErrorMessages = {
  USER_NOT_FOUND: "No account found with the provided email address. Please check and try again.",
  RESET_TOKEN_NOT_FOUND: "No token found with the provided user id. Please check and try again.",
  CREDENTIAL_NOT_FOUND:
    "No credential found with the provided email address. Please check and try again.",
  ROLE_NOT_FOUND: "No role found. Please check and try again.",
  EXPIRED_RESET_TOKEN: "The token has expired. Please request for reset password again.",
  USED_RESET_TOKEN: "The token has been used. Please request for reset password again.",
  EMAIL_IN_USE: "The provided email address is already in use. Please choose a different one.",
  USERNAME_IN_USE: "The provided username is already in use. Please choose a different one.",
  PASSWORD_MISMATCH: "The provided passwords do not match. Please try again.",
  PASSWORD_CRITERIA:
    "Password must meet the required criteria. Please ensure it is at least 8 characters long, includes a number, and has a special character.",
  FAILED_CREATE_USER: "An error occurred while creating the user. Please try again later.",
  FAILED_CREATE_CREDENTIAL:
    "An error occurred while creating credential user. Please try again later.",
  FAILED_UPDATE_PASSWORD: "An error occurred while updating password. Please try again later.",
  FAILED_ASSIGN_ROLE: "An error occurred while assign role to the user. Please try again later.",
  LOGOUT: "An error occurred during logout. Please try again.",
} as const;

type ErrorDetails = Record<string, string | number | boolean>;

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: ErrorDetails,
  ) {
    super(message);
    this.name = "AuthError";
  }

  static create(code: keyof typeof ErrorMessages, details?: ErrorDetails) {
    const message = ErrorMessages[code];
    return new AuthError(message, code, details);
  }
}
