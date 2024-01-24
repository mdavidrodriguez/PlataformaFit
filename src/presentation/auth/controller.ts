import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  CustomError,
  LoginUserDto,
  ModifyPasswordDto,
  RegisterUserDto,
  ResetPasswordDto,
} from "../../domain";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });
    this.authService
      .registerUser(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });
    this.authService
      .loginUser(loginDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    this.authService
      .validateEmail(token)
      .then(() => res.json("Email was validated property"))
      .catch((error) => this.handleError(error, res));
  };

  resetPassword = (req: Request, res: Response) => {
    const [error, resetPassworDto] = ResetPasswordDto.create(req.body);
    if (error) return res.status(400).json({ error });
    this.authService
      .resetPassword(resetPassworDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
  modifyPassword = (req: Request, res: Response) => {
    const { token } = req.params;
    const [error, modifyPasswordDto] = ModifyPasswordDto.create(req.body);
    if (error) return res.status(400).json({ error });
    this.authService
      .modifyPassword(modifyPasswordDto!, token)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
}
