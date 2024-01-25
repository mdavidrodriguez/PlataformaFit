import { exerciseModel } from "../../data";
import { CreateExerciseDto, CustomError, UserEntity } from "../../domain";

export class ExerciseService {
  constructor() {}
  async createdExercise(
    createdExerciseDto: CreateExerciseDto,
    user: UserEntity
  ) {
    const exerciseExist = await exerciseModel.findOne({
      name: createdExerciseDto.name,
    });

    if (exerciseExist) throw CustomError.badRequest("Exercise already exist");
    try {
      const exercise = new exerciseModel({
        ...createdExerciseDto,
        user: user.id,
      });

      await exercise.save();
      return {
        id: exercise._id,
        name: exercise.name,
        description: exercise.description,
        user: exercise.user,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getExercises() {
    try {
      const exercises = await exerciseModel.find();
      return exercises;
    } catch (error) {
      throw CustomError.internalServer("Internal server Error");
    }
  }
}
