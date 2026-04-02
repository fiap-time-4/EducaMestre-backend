import prisma from "../util/prisma";
import { Request, Response } from "express";
import { LoanRepository } from "../repositories/loanRepository";
import { CreateLoanInput, UpdateLoanInput } from "../interfaces/loanInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class LoanController {
  constructor(private loanRepository: LoanRepository) { }

  public createLoan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId,itemType,studentId,returnDate }: CreateLoanInput = req.body;
      const createdById = req.user.id;

      const loanSchema = z.object({
        itemId: z.string().min(1, "Item ID is required"),
        itemType: z.enum(["BOOK", "MATERIAL"], { message: "Item type must be either 'BOOK' or 'MATERIAL'" }),
        studentId: z.string().min(1, "Student ID is required"),
        returnDate: z.coerce.date({ message: "Invalid date format" }),
        createdById: z.string(),
      });

      const parsedLoan = loanSchema.parse({ itemId, itemType, studentId, returnDate, createdById });

      const loan = await this.loanRepository.create(parsedLoan);
      return res.status(201).json(loan);

    } catch (error) {
      console.error("Error creating loan:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getLoans = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { skip, take, id, studentId, itemId, status, itemType } = req.query;
      const createdById = req.user.id;
      
      const getOptions = {
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
        id: id as string | undefined,
        createdById,
        studentId: studentId as string | undefined,
        itemId: itemId as string | undefined,
        status: status as "ACTIVE" | "RETURNED" | "OVERDUE" | undefined,
        itemType: itemType as "BOOK" | "MATERIAL" | undefined

      };

      const getOptionsSchema = z.object({
        id: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        createdById: z.string(),
        studentId: z.string().optional(),
        itemId: z.string().optional(),
        status: z.enum(["ACTIVE", "RETURNED", "OVERDUE"]).optional(),
        itemType: z.enum(["BOOK", "MATERIAL"]).optional()
      });

      const parsedOptions = getOptionsSchema.parse(getOptions);

      const loans = await this.loanRepository.get(parsedOptions);
      return res.status(200).json(loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public deleteLoan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.parse(id);

      await this.loanRepository.delete(parsedId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting loan:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public updateLoan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { status }: UpdateLoanInput = req.body;
      const createdById = req.user.id;

      const loanSchema = z.object({
        id: z.string().min(1, "ID is required"),
        status: z.enum(["ACTIVE", "RETURNED", "OVERDUE"]),
      });

      const parsedLoan = loanSchema.parse({ id, status });

      const loan = await this.loanRepository.update(parsedLoan.id, { status: parsedLoan.status });
      return res.status(200).json(loan);
    } catch (error) {
      console.error("Error updating loan:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

}