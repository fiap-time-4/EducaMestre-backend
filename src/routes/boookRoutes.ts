import { Router } from "express";
import { BookController } from "../controllers/bookController";
import { BookRepository } from "../repositories/bookRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuth" ;

const bookRepository = new BookRepository();
const bookController = new BookController(bookRepository);

export function bookRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, bookController.createBook);
  routes.get("/", ensureAuthenticated, bookController.getBooks);
  routes.delete("/:id", ensureAuthenticated, bookController.deleteBook);
  routes.put("/:id", ensureAuthenticated, bookController.updateBook);

  return routes;

}
