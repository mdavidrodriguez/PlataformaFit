import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ExerciseService } from "../services";
import { ExerciseController } from "./controller";

export class ExerciseRoutes {
  static get routes(): Router {
    const exerciseService = new ExerciseService();
    const controller = new ExerciseController(exerciseService);
    const router = Router();
    router.post("/", [AuthMiddleware.validateJWT], controller.createExercise);
    router.get("/", [AuthMiddleware.validateJWT], controller.getExercises);

    return router;
  }
}
