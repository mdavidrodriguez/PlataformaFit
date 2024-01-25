import { Validators } from "../../../config";

export class CreateExerciseDto {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    // public readonly user: string, //Id
    public readonly img?: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateExerciseDto?] {
    const { name, description, user, img } = props;
    if (!name) return ["Missing name exercise"];
    // if (!user) return ["Missing user"];
    if (!description) return ["Missing name description"];
    // if (!Validators.isMongoID(user)) return ["Invalid user Id"];
    return [undefined, new CreateExerciseDto(name, description, img)];
  }
}
