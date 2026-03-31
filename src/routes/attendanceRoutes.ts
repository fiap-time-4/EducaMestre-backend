import { Router } from "express";
import { AttendanceController } from "../controllers/attendanceController";
import { AttendanceRepository } from "../repositories/attendanceRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuth" ;

const attendanceRepository = new AttendanceRepository();
const attendanceController = new AttendanceController(attendanceRepository);

export function attendanceRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, attendanceController.createAttendance);
  routes.get("/", ensureAuthenticated, attendanceController.getAttendances);
  routes.delete("/:id", ensureAuthenticated, attendanceController.deleteAttendance);

  return routes;

}
