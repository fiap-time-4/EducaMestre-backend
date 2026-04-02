import prisma from '../util/prisma';
import { CreateMaterialInput,ReturnMaterial,Material, UpdateMaterialInput} from "../interfaces/materialInterfaces";

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  createdById?: string;
}

export class MaterialRepository {

  async verifyMaterialExists(id: string): Promise<boolean> {

    const existingMaterial = await prisma.material.findUnique({
        where: {
          id
        }
    });

    return !!existingMaterial; 

  }
    

  async create({ name, description, quantity, createdById }: CreateMaterialInput): Promise<Material> {

    const newMaterial = await prisma.material.create({
      data: {
        name,
        description,
        quantity,
        createdById
      }
    });

    let material: Material = {
      id: newMaterial.id,
      name: newMaterial.name,
      description: newMaterial.description,
      quantity: newMaterial.quantity,
      createdById: newMaterial.createdById
    };

    return material;
  }

  async get({ skip, take, id, createdById }: GetOptions): Promise<ReturnMaterial | ReturnMaterial[]> {

    const fetchedMaterials = await prisma.material.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      },
      where: {
        id ,
        createdById
      }
    });

    const count = await prisma.material.count({
      where: {
        id ,
        createdById
      }
    });

    let materials: Material[] | Material | null = fetchedMaterials.map(material => ({
      id: material.id,
      name: material.name,
      description: material.description,
      quantity: material.quantity,
      createdById: material.createdById
    }));

    materials = Array.isArray(materials) && materials.length === 1 ? materials[0] : materials;
    materials = Array.isArray(materials) && materials.length === 0 ? null : materials;

    return { material: materials,
      count
    };

  }

  async delete(id: string): Promise<void> {
    const materialExists = await this.verifyMaterialExists(id);

    if (!materialExists) {
      throw new Error("Material not found");
    }

    await prisma.material.delete({
      where: {
        id
      }
    });
  }

  async update(id: string, data: UpdateMaterialInput): Promise<Material> {
    const materialExists = await this.verifyMaterialExists(id);

    if (!materialExists) {
      throw new Error("Material not found");
    }

    const updatedMaterial = await prisma.material.update({
      where: {
        id
      },
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
      }
    });

    let materialResult: Material = {
      id: updatedMaterial.id,
      name: updatedMaterial.name,
      description: updatedMaterial.description,
      quantity: updatedMaterial.quantity,
      createdById: updatedMaterial.createdById
    };

    return materialResult;
  }

  async countRemainingMaterialsById(id: string): Promise<void> {}
}
