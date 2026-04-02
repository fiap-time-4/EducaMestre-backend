import { Router } from "express";
import { LoanController } from "../controllers/loanController";
import { LoanRepository } from "../repositories/loanRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuth" ;

const loanRepository = new LoanRepository();
const loanController = new LoanController(loanRepository);

export function loanRoutes(): Router {
  const routes = Router();

  routes.post("/", ensureAuthenticated, loanController.createLoan);
  routes.get("/", ensureAuthenticated, loanController.getLoans);
  routes.delete("/:id", ensureAuthenticated, loanController.deleteLoan);
  routes.put("/:id", ensureAuthenticated, loanController.updateLoan);

  return routes;

}
