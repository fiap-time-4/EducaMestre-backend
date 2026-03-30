import { Router } from "express";
import { TagController } from "../controllers/tagController";
import { TagRepository } from "../repositories/tagRepository";
import { ensureAuthenticated } from "../middlewares/ensure_auth" ;

const tagRepository = new TagRepository();
const tagController = new TagController(tagRepository);

export function tagRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, tagController.createTag);
  routes.get("/", ensureAuthenticated, tagController.getTags);
  routes.delete("/:id", ensureAuthenticated, tagController.deleteTag);

  return routes;

}
