import { Book } from "./bookInterfaces";
import { Material } from "./materialInterfaces";
import { Student } from "./studentInterfaces";

interface Loan {
  id: string;
  itemType: "BOOK" | "MATERIAL";
  item: Book | Material;
  status: "ACTIVE" | "RETURNED" | "OVERDUE";
  student: Student;
  loanDate: Date;
  returnDate: Date | null;
  createdById: string;
}

interface ReturnLoan {
  loan: Loan | Loan[] | null;
  count: number;
}

interface CreateLoanInput {
  itemType: "BOOK" | "MATERIAL";
  itemId: string;
  studentId: string;
  createdById: string;
  returnDate?: Date;
}

interface UpdateLoanInput {
  status: "ACTIVE" | "RETURNED" | "OVERDUE";
}

export { Loan, ReturnLoan, CreateLoanInput, UpdateLoanInput };