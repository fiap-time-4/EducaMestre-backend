import prisma from '../util/prisma';
import { CreateStudentInput,ReturnStudent,Student, UpdateStudentInput} from "../interfaces/studentInterfaces";

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  teacherId?: string;
  tagId?: string;
}

export class StudentRepository {

  async create({ name, email, teacherId, tagId }: CreateStudentInput): Promise<Student> {
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        teacherId,
        tagId
      },
      include: {
        tag: true
      }
    });

    let student: Student = {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      teacherId: newStudent.teacherId,
      tag: newStudent.tag ? {
        id: newStudent.tag.id,
        name: newStudent.tag.name,
        createdById: newStudent.tag.createdById
      } : null
    };

    return student;
  }

  async get({ skip, take, id, teacherId, tagId }: GetOptions): Promise<ReturnStudent | ReturnStudent[]> {

    const fetchedStudents = await prisma.student.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      },
      where: {
        id ,
        teacherId,
        tagId

      },
      include: {
        tag: true
      }
    });

    const count = await prisma.student.count({
      where: {
        id ,
        teacherId,
        tagId
      }
    });

    let students: Student[] | Student | null = fetchedStudents.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      teacherId: student.teacherId,
      tag: student.tag ? {
        id: student.tag.id,
        name: student.tag.name,
        createdById: student.tag.createdById
      } : null
    }));

    students = Array.isArray(students) && students.length === 1 ? students[0] : students;
    students = Array.isArray(students) && students.length === 0 ? null : students;

    return { student: students,
      count
    };

  }

  async delete(id: string, teacherId: string): Promise<void> {
    const student = await prisma.student.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!student) {
      throw new Error("Student not found");
    }

    await prisma.student.delete({
      where: {
        id: student.id
      }
    });
  }

  async update(id: string, teacherId: string, data: UpdateStudentInput): Promise<Student> {
    const student = await prisma.student.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id: student.id
      },
      data: {
        name: data.name ?? student.name,
        email: data.email ?? student.email,
        tagId: data.tagId ?? student.tagId
      },
      include: {
        tag: true
      }
    });

    let studentResult: Student = {
      id: updatedStudent.id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      teacherId: updatedStudent.teacherId,
      tag: updatedStudent.tag ? {
        id: updatedStudent.tag.id,
        name: updatedStudent.tag.name,
        createdById: updatedStudent.tag.createdById
      } : null
    };

    return studentResult;
  }
}