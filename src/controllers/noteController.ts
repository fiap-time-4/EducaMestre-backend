import prisma from "../util/prisma";
import { Request, Response } from "express";
import { NoteRepository } from "../repositories/noteRepository";
import { CreateNoteInput } from "../interfaces/noteInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class NoteController {
  constructor(private noteRepository: NoteRepository) { }

  public createNote = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { content, date }: CreateNoteInput = req.body;
      const createdById = req.user.id;

      const noteSchema = z.object({
        content: z.string().min(1, "Content is required"),
        date: z.coerce.date({ message: "Invalid date format" }),
      });

      noteSchema.parse({ content, date });

      const note = await this.noteRepository.create({ content, date, createdById });
      return res.status(201).json(note);

    } catch (error) {
      console.error("Error creating note:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { skip, take, id, date } = req.query;
      const createdById = req.user.id;
      
      const getOptions = {
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
        id: id as string | undefined,
        date: date ? new Date(date as string) : undefined,
        createdById
      };

      const getOptionsSchema = z.object({
        id: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        date: z.date().optional(),
        createdById: z.string()
      });

      const parsedOptions = getOptionsSchema.parse(getOptions);

      const notes = await this.noteRepository.get(parsedOptions);
      return res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }
}