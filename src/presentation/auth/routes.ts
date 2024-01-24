import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);
    router.post("/register", controller.registerUser);
    router.post("/login", controller.loginUser);
    router.get("/validate-email/:token", controller.validateEmail);
    router.post("/reset/password", controller.resetPassword);
    router.put("/reset/password/:token", controller.modifyPassword);

    return router;
  }
}
