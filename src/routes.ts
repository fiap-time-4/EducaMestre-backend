import { Router, Request, Response } from "express";
import { noteRoutes } from "./routes/noteRoutes";
import { tagRoutes } from "./routes/tagRoutes";
import { studentRoutes } from "./routes/studentRoutes";
import { attendanceRoutes} from "./routes/attendanceRoutes";
import { bookRoutes } from "./routes/boookRoutes";
import { materialRoutes } from "./routes/materialRoutes";
import { loanRoutes } from "./routes/loanRoutes";

const routes = Router();

routes.get('/health', (req: Request, res: Response) => {
  const message = `Health Check OK, Backend is running on port ${process.env.PORT}!`;

  return res.json({ message });
});

routes.use("/notes", noteRoutes());
routes.use("/tags", tagRoutes());
routes.use("/students", studentRoutes());
routes.use("/attendances", attendanceRoutes());
routes.use("/books", bookRoutes());
routes.use("/materials", materialRoutes());
routes.use("/loans", loanRoutes());


export default routes;