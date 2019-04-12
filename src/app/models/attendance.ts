import { Pupils } from "./pupil";

export class Attendances {
  constructor(public attendances: Attendance[], public pupils: Pupils) { }
  empty(): boolean {
    return !this || !this.attendances || this.attendances.length == 0 || this.pupils.empty();
  }

  format(): FormattedAttendance[] {
    let result: FormattedAttendance[] = [];
    if (this.empty()) {
      return result;
    }

    this.attendances.forEach(a => {      
      this.pupils.pupils.forEach(p => {        
        if (a.year != p.year || a.class != p.class) {
          return;
        }
        
        if (a.names.includes(p.name)) {
          result.push({
            id: a.id,
            year: a.year,
            date: a.date,
            class: a.class,
            name: p.name,
            attendance: '',
          });
        } else {
          result.push({
            id: a.id,
            year: a.year,
            date: a.date,
            class: a.class,
            name: p.name,
            attendance: 'x',
          });
        }
      });
    });

    return result;
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
  attendance: string;
}
