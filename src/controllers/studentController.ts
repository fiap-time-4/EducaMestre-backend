import prisma from "../util/prisma";
import { Request, Response } from "express";
import { StudentRepository } from "../repositories/studentRepository";
import { CreateStudentInput, UpdateStudentInput } from "../interfaces/studentInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class StudentController {
  constructor(private studentRepository: StudentRepository) { }

  public createStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, tagId }: CreateStudentInput = req.body;
      const teacherId = req.user.id;

      const studentSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        tagId: z.string().optional(),
        teacherId: z.string()
      });

      const parsedStudent = studentSchema.parse({ name, email, tagId, teacherId });

      const student = await this.studentRepository.create(parsedStudent);
      return res.status(201).json(student);

    } catch (error) {
      console.error("Error creating student:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getStudents = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { skip, take, id, tagId } = req.query;
      const teacherId = req.user.id;
      
      const getOptions = {
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
        id: id as string | undefined,
        tagId: tagId as string | undefined,
        teacherId
      };

      const getOptionsSchema = z.object({
        id: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        teacherId: z.string(),
        tagId: z.string().optional()
      });

      const parsedOptions = getOptionsSchema.parse(getOptions);

      const students = await this.studentRepository.get(parsedOptions);
      return res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public deleteStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.parse(id);

      await this.studentRepository.delete(parsedId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public updateStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { name, email, tagId }: UpdateStudentInput = req.body;
      const teacherId = req.user.id;

      const studentSchema = z.object({
        id: z.string().min(1, "ID is required"),
        name: z.string().min(1, "Name is required").optional(),
        email: z.string().email("Invalid email address").optional(),
        tagId: z.string().optional(),
        teacherId: z.string()
      });

      const parsedStudent = studentSchema.parse({ id, name, email, tagId, teacherId });

      const student = await this.studentRepository.update(parsedStudent.id, parsedStudent);
      return res.status(200).json(student);
    } catch (error) {
      console.error("Error updating student:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }
}