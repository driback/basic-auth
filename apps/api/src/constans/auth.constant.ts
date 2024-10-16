import { TimeSpan } from "oslo";

export const SessionConst = {
  COOKIE_NAME: "auth_session",
  REFRES_TOKEN_COOKIE_NAME: "ss_rf",
  SESSION_EXPIRES_IN: new TimeSpan(30, "m"),
  REFRESH_TOKEN_SESSION_EXPIRES_IN: new TimeSpan(7, "d"),
  CSRF_TOKEN_LENGTH: 24,
  REFRESH_TOKEN_LENGTH: 24,
  MAX_SESSION_PER_USER: 5,
  CLEANUP_INTERNAL: 1000 * 60 * 60,
  GRADUAL_EXPIRATION_FACTOR: 0.1,
};

export const AuthConst = {
  RESET_TOKEN_EXPIRES_IN: new TimeSpan(10, "m"),
  RESET_TOKEN_LENGTH: 24,
};
