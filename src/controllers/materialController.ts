import prisma from "../util/prisma";
import { Request, Response } from "express";
import { MaterialRepository } from "../repositories/materialRepository";
import { CreateMaterialInput, UpdateMaterialInput } from "../interfaces/materialInterfaces";
import { AppError } from "../util/appError";
import * as z from "zod";

export class MaterialController {
  constructor(private materialRepository: MaterialRepository) { }

  public createMaterial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, description, quantity }: CreateMaterialInput = req.body;
      const createdById = req.user.id;

      const materialSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity is required"),
        createdById: z.string(),
      });

      const parsedMaterial = materialSchema.parse({ name, description, quantity, createdById });

      const material = await this.materialRepository.create(parsedMaterial);
      return res.status(201).json(material);

    } catch (error) {
      console.error("Error creating material:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public getMaterials = async (req: Request, res: Response): Promise<Response> => {
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

      const materials = await this.materialRepository.get(parsedOptions);
      return res.status(200).json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public deleteMaterial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const idSchema = z.string().min(1, "ID is required");
      const parsedId = idSchema.parse(id);

      await this.materialRepository.delete(parsedId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting material:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }

  public updateMaterial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { name, description, quantity }: UpdateMaterialInput = req.body;
      const createdById = req.user.id;

      const materialSchema = z.object({
        id: z.string().min(1, "ID is required"),
        name: z.string().min(1, "Name is required").optional(),
        description: z.string().min(1, "Description is required").optional(),
        quantity: z.number().min(1, "Quantity is required").optional(),
        createdById: z.string()
      });

      const parsedMaterial = materialSchema.parse({ id, name, description, quantity, createdById });

      const material = await this.materialRepository.update(parsedMaterial.id, parsedMaterial);
      return res.status(200).json(material);
    } catch (error) {
      console.error("Error updating material:", error);
      throw new AppError(error instanceof Error ? error.message : "Internal Server Error", 500);
    }
  }
}