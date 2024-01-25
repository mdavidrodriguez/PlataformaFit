import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { ExerciseRoutes } from "./exercise/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/exercise", ExerciseRoutes.routes);

    return router;
  }
}
