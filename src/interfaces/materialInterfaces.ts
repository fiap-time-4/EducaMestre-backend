interface Material {
  id: string;
  name: string;
  description: string;
  quantity: number;
  createdById: string;
}

interface ReturnMaterial {
  material: Material | Material[] | null;
  count: number;
}

interface CreateMaterialInput {
  name: string;
  description: string;
  quantity: number;
  createdById: string;
}

interface UpdateMaterialInput {
  name?: string;
  description?: string;
  quantity?: number;
}

export { Material, ReturnMaterial, CreateMaterialInput, UpdateMaterialInput };