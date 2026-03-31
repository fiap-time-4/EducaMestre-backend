import prisma from '../util/prisma';
import { Attendance,CreateAttendanceInput,ReturnAttendance } from "../interfaces/attendanceInterfaces";

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  teacherId?: string;
  date?: Date;
  studentId?: string;
}

export class AttendanceRepository {

  async verifyAttendanceExists(attendanceId?: string, studentId?: string, teacherId?: string, date?: Date): Promise<boolean> {

    const existingAttendance = await prisma.attendance.findFirst({
        where: {
          id: attendanceId,
          studentId,
          teacherId,
          date
        }
    });

    return !!existingAttendance;
  }

  async verifyStudentAndTeacher(studentId: string, teacherId: string): Promise<boolean> {

    const student = await prisma.student.findUnique({
      where: {
        id: studentId
      }
    });

    if (!student) {
      return false;
    }

    const teacher = await prisma.user.findUnique({
      where: {
        id: teacherId
      }
    });

    if (!teacher) {
      return false;
    }

    return true;
  }

  async create({ studentId, teacherId, date }: CreateAttendanceInput): Promise<Attendance> {

    const studentAndTeacherValid = await this.verifyStudentAndTeacher(studentId, teacherId);
    if (!studentAndTeacherValid) {
      throw new Error("Invalid student or teacher");
    }

    const attendanceExists = await this.verifyAttendanceExists(undefined, studentId, teacherId, date);
    if (attendanceExists) {
      throw new Error("Attendance for this student on this date already exists");
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        studentId,
        teacherId,
        date
      }
    });

    let attendance: Attendance = {
      id: newAttendance.id,
      studentId: newAttendance.studentId,
      teacherId: newAttendance.teacherId,
      date: newAttendance.date
    };

    return attendance;
  }

  async get({ skip, take, id, teacherId, date, studentId }: GetOptions): Promise<ReturnAttendance | ReturnAttendance[]> {

    const fetchedAttendance = await prisma.attendance.findMany({
      skip,
      take,
      orderBy: {
        date: "desc"
      },
      where: {
        id ,
        teacherId,
        date,
        studentId
      }
    });

    const count = await prisma.attendance.count({
      where: {
        id ,
        teacherId,
        date,
        studentId
      }
    });

    let attendance: Attendance[] | Attendance | null = fetchedAttendance.map(att => ({
      id: att.id,
      studentId: att.studentId,
      teacherId: att.teacherId,
      date: att.date
    }));

    attendance = Array.isArray(attendance) && attendance.length === 1 ? attendance[0] : attendance;
    attendance = Array.isArray(attendance) && attendance.length === 0 ? null : attendance;

    return { attendance,
      count
    };

  }

  async delete(id: string): Promise<void> {


    const attendanceExists = await this.verifyAttendanceExists(id);

    if (!attendanceExists) {
      throw new Error("Attendance not found");
    }

    await prisma.attendance.delete({
      where: {
        id
      }
    });
  }
}