import { JwtAdapter, bcrypt } from "../../config";
import { UserModel } from "../../data";
import { envs } from "../../config";
import {
  CustomError,
  LoginUserDto,
  ModifyPasswordDto,
  RegisterUserDto,
  ResetPasswordDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";
import { generarId } from "../../config/generateId";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existeUser = await UserModel.findOne({
      email: registerUserDto.email,
    });
    if (existeUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);
      user.password = bcrypt.hash(registerUserDto.password);
      await user.save();

      this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({
        id: user.id,
        email: user.email,
      });
      return { user: userEntity, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("Email is not valid");
    const isMatching = bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatching) throw CustomError.badRequest("Password is not valid");

    if (user.emailValidated === false) {
      throw CustomError.unauthorized("La cuenta no ha sido confirmada");
    }

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
      email: user.email,
    });
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    return {
      user: userEntity,
      token: token,
    };
  }

  public resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
    const user = await UserModel.findOne({ email: resetPasswordDto.email });
    if (!user) throw CustomError.badRequest("Email is not valid");

    if (user.emailValidated === false) {
      throw CustomError.unauthorized("La cuenta no ha sido confirmada");
    }
    user.token = generarId();
    await user.save();
    this.sendEmailResetPassword(user.email, user.token);

    const { password, ...userEntity } = UserEntity.fromObject(user);
    return {
      user: userEntity,
      msg: "Hemos enviando a su correo las indicaciones",
    };
  };

  public modifyPassword = async (
    modifyPasswordDdto: ModifyPasswordDto,
    token: string
  ) => {
    const tokenValid = await UserModel.findOne({ token });
    try {
      if (!tokenValid || token === "")
        throw CustomError.badRequest("Token no valido o inexistente");
      tokenValid.password = bcrypt.hash(modifyPasswordDdto.password);
      tokenValid.token = "";
      await tokenValid.save();
      const { password, ...userEntity } = UserEntity.fromObject(tokenValid);
      return {
        msg: "Password Restablecida Correctamente",
        status: "success",
        user: userEntity,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({
      email,
    });
    if (!token) throw CustomError.internalServer("Error getting token");
    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email </h1>
    <p>Click on the following linl to validate your email</p>
    <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "validate your email",
      htmlBody: html,
    };
    const isSet = await this.emailService.sendEmail(options);
    if (!isSet) throw CustomError.internalServer("Error sending email");
    return true;
  };

  private sendEmailResetPassword = async (email: string, token: string) => {
    const link = `${envs.WEBSERVICE_URL}/auth/reset/password/${token}`;
    const html = `
    <h1>Restablecer Contraseña </h1>
    <p>Click on the following link to reset password</p>
    <a href="${link}">Reset Password: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "validate your email",
      htmlBody: html,
    };
    const isSet = await this.emailService.sendEmail(options);
    if (!isSet) throw CustomError.internalServer("Error sending email");
    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("Invalid token");
    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");
    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer("Email not exist");
    user.emailValidated = true;
    await user.save();
    return true;
  };
}
