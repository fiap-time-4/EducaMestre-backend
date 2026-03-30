import { Tag } from "./tagInterfaces";

interface Student {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  tag?: Tag | null;
}

interface ReturnStudent {
  student: Student | Student[] | null;
  count: number;
}

interface CreateStudentInput {
  name: string;
  email: string;
  teacherId: string;
  tagId?: string;
}

interface UpdateStudentInput {
  name?: string;
  email?: string;
  tagId?: string;
}

export { Student, ReturnStudent, CreateStudentInput, UpdateStudentInput };