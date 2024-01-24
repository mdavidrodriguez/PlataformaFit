export class ModifyPasswordDto {
  private constructor(public password: string) {}

  static create(object: { [key: string]: any }): [string?, ModifyPasswordDto?] {
    const { password } = object;
    if (!password) return ["Missing password", undefined];
    if (password.length < 6) return ["Very short password"];

    return [undefined, new ModifyPasswordDto(password)];
  }
}
