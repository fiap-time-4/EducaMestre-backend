import prisma from "../util/prisma";
import { Request, Response } from "express";
import { TagRepository } from "../repositories/tagRepository";
import { CreateTagInput } from "../interfaces/tagInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class TagController {
  constructor(private tagRepository: TagRepository) { }

  public createTag = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name }: CreateTagInput = req.body;
      const createdById = req.user.id;

      const tagSchema = z.object({
        name: z.string().min(1, "Name is required"),
      });

      tagSchema.parse({ name });

      const tag = await this.tagRepository.create({ name, createdById });
      return res.status(201).json(tag);

    } catch (error) {
      console.error("Error creating tag:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getTags = async (req: Request, res: Response): Promise<Response> => {
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

      const tags = await this.tagRepository.get(parsedOptions);
      return res.status(200).json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public deleteTag = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.parse(id);

      await this.tagRepository.delete(parsedId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }
}