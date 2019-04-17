import { Holiday, Holidays } from "./holiday";

export class Attendances {
  constructor(public attendances: Attendance[], public holidays: Holidays) { }
  empty(): boolean {
    return !this || !this.attendances || this.attendances.length == 0;
  }

  format(): FormattedAttendance[] {
    let result: FormattedAttendance[] = [];
    if (this.empty()) {
      return result;
    }

    this.attendances.forEach(a => {
      a.names.forEach(n => {
        result.push({
          id: a.id,
          year: a.year,
          date: a.date,
          class: a.class,
          name: n,
          holiday: 0,
        });
      });
    });

    if (this.holidays.empty() == false) {
      this.holidays.holidays.forEach(h => {
        result.push({
          id: -1,
          year: '',
          date: h.date,
          class: '',
          name: '',
          holiday: h.type,
        });
      });
    }

    return result.sort((r1, r2): number => {
      let d = new Date(r2.date).getTime() - new Date(r1.date).getTime();
      if (d > 0) return 1;
      if (d < 0) return -1;
      if (r2.class > r1.class) return 1;
      if (r2.class < r1.class) return -1;

      return 0;
    });
  }
}

export class Attendance {
  id: number;
  year: string;
  date: string;
  class: string;
  names: string[];
}

export class FormattedAttendance {
  id: number;
  year: string;
  date: string;
  class: string;
  name: string;
  holiday: number;
}

export class AttendanceResponse {
  attendances: Attendance[];
  holidays: Holiday[];
}