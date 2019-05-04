import { Holiday, Holidays } from "./holiday";

export class Attendances {
  constructor(public attendances: Attendance[], public holidays: Holidays) { }
  empty(): boolean {
    return !this || !this.attendances || !this.attendances.length;
  }

  format(): FormattedAttendance[] {
    let result: FormattedAttendance[] = [];
    if (this.empty()) {
      return result;
    }

    this.attendances.forEach(a => {
      if (a.attendances && a.attendances.length > 0) {
        a.attendances.forEach(n => {
          result.push({
            id: a.id,
            year: a.year,
            date: a.date,
            class: a.class,
            name: n,
            attendance: 'o',
            holiday: 0,            
            edititems: [
              {
                year: a.year,
                date: a.date,
                class: a.class,
                name: n,
                attendance: 'o',
              },
              {
                year: a.year,
                date: a.date,
                class: a.class,
                name: n,
                attendance: 'x',
              }
            ],
          });
        });
      }

      if (a.absences && a.absences.length > 0) {
        a.absences.forEach(n => {
          result.push({
            id: a.id,
            year: a.year,
            date: a.date,
            class: a.class,
            name: n,
            attendance: 'x',
            holiday: 0,            
            edititems: [
              {
                year: a.year,
                date: a.date,
                class: a.class,
                name: n,
                attendance: 'o',
              },
              {
                year: a.year,
                date: a.date,
                class: a.class,
                name: n,
                attendance: 'x',
              }
            ],
          });
        });
      }
    });

    if (this.holidays.empty() == false) {
      this.holidays.holidays.forEach(h => {
        result.push({
          id: -1,
          year: '',
          date: h.date,
          class: '',
          name: '',
          attendance: '-',
          holiday: h.type,
          edititems: [],          
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
  attendances: string[];
  absences: string[];
}

export class FormattedAttendance {
  id: number;
  year: string;
  date: string;
  class: string;
  name: string;
  attendance: string;
  holiday: number;
  edititems: Partial<FormattedAttendance>[];
}

export class AttendanceResponse {
  attendances: Attendance[];
  holidays: Holiday[];
}