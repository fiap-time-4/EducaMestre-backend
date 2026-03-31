import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { StudentRepository } from "../repositories/studentRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuth" ;

const studentRepository = new StudentRepository();
const studentController = new StudentController(studentRepository);

export function studentRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, studentController.createStudent);
  routes.get("/", ensureAuthenticated, studentController.getStudents);
  routes.delete("/:id", ensureAuthenticated, studentController.deleteStudent);
  routes.put("/:id", ensureAuthenticated, studentController.updateStudent);

  return routes;

}
