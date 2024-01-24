import { Router } from "express";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    router.post("/");

    return router;
  }
}
