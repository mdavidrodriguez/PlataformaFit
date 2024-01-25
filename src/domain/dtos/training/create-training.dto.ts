import { Validators } from "../../../config";

export class CreateExerciseDto {
  private constructor(
    public readonly user: string,
    public readonly routine: string,
    public readonly date?: string,
    public readonly completed?: Boolean
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateExerciseDto?] {
    const { user, routine, date, completed = false } = props;
    if (!user) return ["Missing user", undefined];
    if (!Validators.isMongoID(user)) return ["Invalid user Id"];
    if (!routine) return ["Missing routine", undefined];
    if (!Validators.isMongoID(routine)) return ["Invalid routine Id"];
    return [undefined, new CreateExerciseDto(user, routine, date, completed)];
  }
}
