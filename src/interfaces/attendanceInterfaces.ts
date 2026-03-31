interface Attendance {
  id: string;
  studentId: string;
  teacherId: string;
  date: Date;
}

interface ReturnAttendance {
  attendance: Attendance | Attendance[] | null;
  count: number;
}

interface CreateAttendanceInput {
  studentId: string;
  teacherId: string;
  date: Date;
}

export { Attendance, ReturnAttendance, CreateAttendanceInput };