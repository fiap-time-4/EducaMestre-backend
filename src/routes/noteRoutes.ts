import { Router } from "express";
import { NoteController } from "../controllers/noteController";
import { NoteRepository } from "../repositories/noteRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuth" ;

const noteRepository = new NoteRepository();
const noteController = new NoteController(noteRepository);

export function noteRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, noteController.createNote);
  routes.get("/", ensureAuthenticated, noteController.getNotes);

  return routes;

}
