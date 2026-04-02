import prisma from '../util/prisma';
import { CreateLoanInput, Loan, ReturnLoan, UpdateLoanInput } from "../interfaces/loanInterfaces";

import { StudentRepository } from "./studentRepository"
import { BookRepository } from "./bookRepository"
import { MaterialRepository } from "./materialRepository";
import { Material, ReturnMaterial } from '../interfaces/materialInterfaces';
import { Book, ReturnBook } from '../interfaces/bookInterfaces';
import { Student } from '../interfaces/studentInterfaces';

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  createdById?: string;
  studentId?: string;
  itemId?: string;
  status?: "ACTIVE" | "RETURNED" | "OVERDUE";
  itemType?: "BOOK" | "MATERIAL";
}

export class LoanRepository {
  studentRepository = new StudentRepository();
  bookRepository = new BookRepository();
  materialRepository = new MaterialRepository();

  async verifyLoanExists(id: string): Promise<boolean> {

    const existingLoan = await prisma.loan.findUnique({
      where: {
        id
      }
    });

    return !!existingLoan;

  }

  async getStudent(studentId: string): Promise<Student | undefined> {
    const student = await this.studentRepository.get({ id: studentId });
    if (!student || (Array.isArray(student) && student.length === 0)) {
      throw new Error("Student not found");
    }

    const returnStudent = Array.isArray(student) ? student[0] : student;

    if (!returnStudent) {
      throw new Error("Student not found");
    }

    return returnStudent.student as Student;
  }


  async getItem(itemId: string, itemType: "BOOK" | "MATERIAL"): Promise<Book | Material | undefined> {
    if (itemType === "BOOK") {
      const book = await this.bookRepository.get({ id: itemId, createdById: undefined });
      if (!book || (Array.isArray(book) && book.length === 0 )) {
        throw new Error("Book not found");
      }

      const returnBook = Array.isArray(book) ? book[0] : book;

      if (!returnBook || returnBook.count === 0) {
        throw new Error("Book not found");
      }

      return returnBook.book as Book;
    }

    else if (itemType === "MATERIAL") {
      const material = await this.materialRepository.get({ id: itemId, createdById: undefined });
      if (!material || (Array.isArray(material) && material.length === 0)) {
        throw new Error("Material not found");
      }

      const returnMaterial = Array.isArray(material) ? material[0] : material;

      if (!returnMaterial || returnMaterial.count === 0) {
        throw new Error("Material not found");
      }
      return returnMaterial.material as Material;
    }
  }

  async create({ itemId, itemType, studentId, returnDate, createdById }: CreateLoanInput): Promise<Loan> {

    const student = await this.getStudent(studentId);

    if (!student || (Array.isArray(student) && student.length === 0)) {
      throw new Error("Student not found");
    }

    const item = await this.getItem(itemId, itemType);

    if (!item) {
      throw new Error(`${itemType} not found`);
    }

    if (item.quantity <= 0) {
      throw new Error(`${itemType} is not available for loan`);
    }



    const newLoan = await prisma.loan.create({
      data: {
        itemId,
        itemType,
        studentId,
        returnDate,
        createdById
      }
    });

    let loan: Loan = {
      id: newLoan.id,
      itemType: newLoan.itemType,
      item,
      student,
      status: newLoan.status,
      loanDate: newLoan.loanDate,
      returnDate: newLoan.returnDate,
      createdById: newLoan.createdById
    };

    return loan;
  }

  async get({ skip, take, id, createdById,itemId,itemType,status,studentId}: GetOptions): Promise<ReturnLoan | ReturnLoan[]> {

    const fetchedLoans = await prisma.loan.findMany({
      skip,
      take,
      orderBy: {
        loanDate: "desc"
      },
      where: {
        id,
        createdById,
        itemId,
        itemType,
        status,
        studentId
      },
      include: {
        student: true,
      }
    });

    const count = await prisma.loan.count({
      where: {
        id,
        createdById,
        itemId,
        itemType,
        status,
        studentId
      }
    });

    let loans: Loan[] | Loan = [];

    for (const loan of fetchedLoans) {
      const item = await this.getItem(loan.itemId, loan.itemType);
      if (!item) {
        throw new Error(`${loan.itemType} not found`);
      }

      loans.push({
        id: loan.id,
        itemType: loan.itemType,
        item,
        student: loan.student,
        status: loan.status,
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        createdById: loan.createdById
      });
    }

    loans = Array.isArray(loans) && loans.length === 1 ? loans[0] : loans;

    return {
      loan: loans,
      count
    };

  }

  async delete(id: string): Promise<void> {
    const loanExists = await this.verifyLoanExists(id);

    if (!loanExists) {
      throw new Error("Loan not found");
    }

    await prisma.loan.delete({
      where: {
        id
      }
    });
  }

  async update(id: string, data: UpdateLoanInput): Promise<Loan> {
    const loanExists = await this.verifyLoanExists(id);

    if (!loanExists) {
      throw new Error("Loan not found");
    }

    const updatedLoan = await prisma.loan.update({
      where: {
        id
      },
      data: {
        status: data.status
      },
      include: {
        student: true,
      }
    });

    const item = await this.getItem(updatedLoan.itemId, updatedLoan.itemType);

    if (!item) {
      throw new Error(`${updatedLoan.itemType} not found`);
    }

    let loanResult: Loan = {
      id: updatedLoan.id,
      itemType: updatedLoan.itemType,
      item,
      student: updatedLoan.student,
      status: updatedLoan.status,
      loanDate: updatedLoan.loanDate,
      returnDate: updatedLoan.returnDate,
      createdById: updatedLoan.createdById
    };

    return loanResult;
  }

}
