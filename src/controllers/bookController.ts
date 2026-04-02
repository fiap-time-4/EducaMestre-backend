import prisma from "../util/prisma";
import { Request, Response } from "express";
import { BookRepository } from "../repositories/bookRepository";
import { CreateBookInput, UpdateBookInput } from "../interfaces/bookInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class BookController {
  constructor(private bookRepository: BookRepository) { }

  public createBook = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, author, quantity }: CreateBookInput = req.body;
      const createdById = req.user.id;

      const bookSchema = z.object({
        title: z.string().min(1, "Title is required"),
        author: z.string().min(1, "Author is required"),
        quantity: z.number().min(1, "Quantity is required"),
        createdById: z.string(),
      });

      const parsedBook = bookSchema.parse({ title, author, quantity, createdById });

      const book = await this.bookRepository.create(parsedBook);
      return res.status(201).json(book);

    } catch (error) {
      console.error("Error creating book:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getBooks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { skip, take, id } = req.query;
      const createdById = req.user.id;
      
      const getOptions = {
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
        id: id as string | undefined,
        createdById
      };

      const getOptionsSchema = z.object({
        id: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        createdById: z.string()
      });

      const parsedOptions = getOptionsSchema.parse(getOptions);

      const books = await this.bookRepository.get(parsedOptions);
      return res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public deleteBook = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.parse(id);

      await this.bookRepository.delete(parsedId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting book:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public updateBook = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { title, author, quantity }: UpdateBookInput = req.body;
      const createdById = req.user.id;

      const bookSchema = z.object({
        id: z.string().min(1, "ID is required"),
        title: z.string().min(1, "Title is required").optional(),
        author: z.string().min(1, "Author is required").optional(),
        quantity: z.number().min(1, "Quantity is required").optional(),
        createdById: z.string()
      });

      const parsedBook = bookSchema.parse({ id, title, author, quantity, createdById });

      const book = await this.bookRepository.update(parsedBook.id, parsedBook);
      return res.status(200).json(book);
    } catch (error) {
      console.error("Error updating book:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }
}