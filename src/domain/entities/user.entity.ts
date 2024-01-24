import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: string,
    public password: string,
    public role: string[],
    public birthDate?: string,
    public height?: string,
    public weight?: string,
    public img?: string,
    public token?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const {
      id,
      _id,
      name,
      email,
      emailValidated,
      password,
      role,
      birthDate,
      height,
      weight,
      img,
      token,
    } = object;
    if (!_id && !id) {
      throw CustomError.badRequest("Missing");
    }
    if (!name) throw CustomError.badRequest("Missing name");
    if (!email) throw CustomError.badRequest("Missing name");
    if (!emailValidated === undefined)
      throw CustomError.badRequest("Missing email validated");
    if (!password) throw CustomError.badRequest("Missing Password");
    if (!role) throw CustomError.badRequest("Missing role");

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      birthDate,
      height,
      weight,
      img,
      token
    );
  }
}
