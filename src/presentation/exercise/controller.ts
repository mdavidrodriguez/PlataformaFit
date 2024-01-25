import { Request, Response } from "express";
import { ExerciseService } from "../services";
import { CreateExerciseDto, CustomError, UserEntity } from "../../domain";

export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  createExercise = async (req: Request, res: Response) => {
    const [error, createexerciseDto] = CreateExerciseDto.create({
      ...req.body,
      user: req.body.user.id,
    });

    if (error) return res.status(400).json({ error });
    this.exerciseService
      .createdExercise(createexerciseDto!, req.body.user)
      .then((exercise) => res.status(201).json(exercise))
      .catch((error) => this.handleError(error, res));
  };

  getExercises = async (req: Request, res: Response) => {
    // const [error, paginationDto] = PaginationDto.create(+page, +limit);
    // if (error) return res.status(400).json({ error });

    this.exerciseService
      .getExercises()
      .then((exercises) => res.json(exercises))
      .catch((error) => this.handleError(error, res));
  };
}
