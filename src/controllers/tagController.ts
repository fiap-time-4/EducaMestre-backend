import prisma from "../util/prisma";
import { Request, Response } from "express";
import { TagRepository } from "../repositories/tagRepository";
import { CreateTagInput } from "../interfaces/tagInterfaces";
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

      const parsedTag = tagSchema.safeParse({ name });
      if (!parsedTag.success) {
        return res.status(400).json({ error: parsedTag.error });
      }

      const tag = await this.tagRepository.create({ name, createdById });
      return res.status(201).json(tag);

    } catch (error) {
      console.error("Error creating tag:", error);
      return res.status(500).json({ error: "Internal Server Error" });
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

      const parsedOptions = getOptionsSchema.safeParse(getOptions);
      if (!parsedOptions.success) {
        return res.status(400).json({ error: parsedOptions.error });
      }

      const tags = await this.tagRepository.get(parsedOptions.data);
      return res.status(200).json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public deleteTag = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const createdById = req.user.id;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.safeParse(id);
      if (!parsedId.success) {
        return res.status(400).json({ error: parsedId.error });
      }

      await this.tagRepository.delete(parsedId.data, createdById);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting tag:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}