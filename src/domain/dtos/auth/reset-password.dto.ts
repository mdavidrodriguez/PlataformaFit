import { regularExps } from "../../../config";

export class ResetPasswordDto {
  private constructor(public email: string) {}

  static create(object: { [key: string]: any }): [string?, ResetPasswordDto?] {
    const { email } = object;
    if (!email) return ["Missing email", undefined];
    if (!regularExps.email.test(email)) return ["Email is not valid"];

    return [undefined, new ResetPasswordDto(email)];
  }
}
