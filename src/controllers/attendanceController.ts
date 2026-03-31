import prisma from "../util/prisma";
import { Request, Response } from "express";
import { AttendanceRepository } from "../repositories/attendanceRepository";
import { CreateAttendanceInput } from "../interfaces/attendanceInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class AttendanceController {
  constructor(private attendanceRepository: AttendanceRepository) { }

  public createAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { studentId, date }: CreateAttendanceInput = req.body;
      const teacherId = req.user.id;

      const attendanceSchema = z.object({
        studentId: z.string().min(1, "Student ID is required"),
        teacherId: z.string().min(1, "Teacher ID is required"),
        date: z.date(),
      });

      const parsedAttendance = attendanceSchema.parse({ studentId, teacherId, date: new Date(date) });

      const attendance = await this.attendanceRepository.create(parsedAttendance);
      return res.status(201).json(attendance);

    } catch (error) {
      console.error("Error creating attendance:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getAttendances = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { skip, take, id, date, studentId } = req.query;
      const teacherId = req.user.id;
      
      const getOptions = {
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
        id: id as string | undefined,
        date: date ? new Date(date as string) : undefined,
        studentId: studentId as string | undefined,
        teacherId
      };

      const getOptionsSchema = z.object({
        id: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        date: z.date().optional(),
        studentId: z.string().optional(),
        teacherId: z.string().optional()
      });

      const parsedOptions = getOptionsSchema.parse(getOptions);

      const attendance = await this.attendanceRepository.get(parsedOptions);
      return res.status(200).json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public deleteAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.parse(id);

      await this.attendanceRepository.delete(parsedId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }
}