import { Hono } from "hono";
import {
  getMeController,
  loginController,
  logoutController,
  resetPasswordController,
  sendResetPasswordLinkController,
  signupController,
} from "~/controllers/auth.controller";

const app = new Hono();

const authRoute = app
  .post("/login", ...loginController)
  .post("/signup", ...signupController)
  .post("/logout", ...logoutController)
  .get("/me", ...getMeController)
  .post("/send-reset-password-link", ...sendResetPasswordLinkController)
  .post("/reset-password", ...resetPasswordController);

export default authRoute;
