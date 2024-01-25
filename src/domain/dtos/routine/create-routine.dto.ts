export class CreateRoutineDto {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly difficulty: string,
    public readonly duration: string,
    public readonly exercises?: string[]
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateRoutineDto?] {
    const { name, description, difficulty, duration, exercises } = props;
    if (!name) return ["Missing name routine", undefined];
    if (!description) return ["Missing description", undefined];
    if (!difficulty) return ["Missing difficulty", undefined];
    if (!duration) return ["Missing duration", undefined];

    return [
      undefined,
      new CreateRoutineDto(name, description, difficulty, duration, exercises),
    ];
  }
}
