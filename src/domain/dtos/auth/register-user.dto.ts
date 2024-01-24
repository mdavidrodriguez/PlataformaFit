import { regularExps } from "../../../config";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public birthDate: string,
    public height: string,
    public weight: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password, birthDate, height, weight } = object;
    if (!name) return ["Missing name", undefined];
    if (!email) return ["Missing email", undefined];
    if (!regularExps.email.test(email))
      return ["Email is not valid", undefined];
    if (!password) return ["Missing Password", undefined];
    if (password.length < 6) return ["Password to short"];
    return [
      undefined,
      new RegisterUserDto(name, email, password, birthDate, height, weight),
    ];
  }
}
