import { Router, Request, Response } from "express";
import { noteRoutes } from "./routes/noteRoutes";
import { tagRoutes } from "./routes/tagRoutes";
import { studentRoutes } from "./routes/studentRoutes";

const routes = Router();

routes.get('/health', (req: Request, res: Response) => {
  const message = `Health Check OK, Backend is running on port ${process.env.PORT}!`;

  return res.json({ message });
});

routes.use("/notes", noteRoutes());
routes.use("/tags", tagRoutes());
routes.use("/students", studentRoutes());


export default routes;