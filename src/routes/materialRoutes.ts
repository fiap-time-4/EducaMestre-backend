import { Router } from "express";
import { MaterialController } from "../controllers/materialController";
import { MaterialRepository } from "../repositories/materialRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuth" ;

const materialRepository = new MaterialRepository();
const materialController = new MaterialController(materialRepository);

export function materialRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, materialController.createMaterial);
  routes.get("/", ensureAuthenticated, materialController.getMaterials);
  routes.delete("/:id", ensureAuthenticated, materialController.deleteMaterial);
  routes.put("/:id", ensureAuthenticated, materialController.updateMaterial);

  return routes;

}
