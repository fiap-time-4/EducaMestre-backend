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

  async verifyStudentExists(id: string): Promise<boolean> {

    const existingStudent = await prisma.student.findUnique({
        where: {
          id
        }
    });

    return !!existingStudent; 

  }

  async verifyTagExists(tagId: string): Promise<boolean> {

    const existingTag = await prisma.tag.findUnique({
        where: {
          id: tagId
        }
    });
  
    return !!existingTag;

  }
    

  async create({ name, email, teacherId, tagId }: CreateStudentInput): Promise<Student> {

    if (tagId) {
      const tagExists = await this.verifyTagExists(tagId);
      if (!tagExists) {
        throw new Error("Tag not found");
      }
    }

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

  async delete(id: string): Promise<void> {
    const studentExists = await this.verifyStudentExists(id);

    if (!studentExists) {
      throw new Error("Student not found");
    }

    await prisma.student.delete({
      where: {
        id
      }
    });
  }

  async update(id: string, data: UpdateStudentInput): Promise<Student> {
    const studentExists = await this.verifyStudentExists(id);

    if (!studentExists) {
      throw new Error("Student not found");
    }

    if (data.tagId) {
      const tagExists = await this.verifyTagExists(data.tagId);
      if (!tagExists) {
        throw new Error("Tag not found");
      }
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id
      },
      data: {
        name: data.name,
        email: data.email,
        tagId: data.tagId,
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