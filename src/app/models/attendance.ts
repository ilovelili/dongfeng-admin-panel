import { Pupil } from "./pupil";
import { Constant } from "./const";

export class Attendance {
  date: string;
  pupil: Pupil;
  holiday: number;
  absent: boolean;

  format(): FormattedAttendance {
    let formattedAttendance = new FormattedAttendance();
    formattedAttendance.date = this.date;

    // if not working days, set to -
    if (Constant.Instance().holidays["weekends"] == this.holiday) {
      formattedAttendance.class = "-";
      formattedAttendance.name = "-";
      formattedAttendance.attendance = "-";
      formattedAttendance.pupilId = NaN;
      formattedAttendance.classId = NaN;
      formattedAttendance.isWorkingDay = false;
      formattedAttendance.isWeekend = true;
      formattedAttendance.isHoliday = false;
    } else if (Constant.Instance().holidays["holidays"] == this.holiday) {
      formattedAttendance.class = "-";
      formattedAttendance.name = "-";
      formattedAttendance.attendance = "-";
      formattedAttendance.pupilId = NaN;
      formattedAttendance.classId = NaN;
      formattedAttendance.isWorkingDay = false;
      formattedAttendance.isWeekend = false;
      formattedAttendance.isHoliday = true;
    } else {
      formattedAttendance.class = this.pupil.class.name;
      formattedAttendance.name = this.pupil.name;
      formattedAttendance.attendance = this.absent ? 'x' : 'o';
      formattedAttendance.pupilId = this.pupil.id;
      formattedAttendance.classId = this.pupil.class.id;
      formattedAttendance.isWorkingDay = true;
      formattedAttendance.isWeekend = false;
      formattedAttendance.isHoliday = false;
    }

    return formattedAttendance;
  }

  static sort(formattedAttendances: FormattedAttendance[]): FormattedAttendance[] {
    return formattedAttendances.sort((r1, r2): number => {
      let d = new Date(r2.date).getTime() - new Date(r1.date).getTime();
      if (d > 0) return 1;
      if (d < 0) return -1;
      if (r2.class > r1.class) return 1;
      if (r2.class < r1.class) return -1;

      return 0;
    });
  }
}

export class FormattedAttendance {
  date: string;
  class: string;
  classId: number;
  name: string;
  pupilId: number;
  attendance: string;
  holiday: number;
  isWorkingDay: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  edititems: Partial<FormattedAttendance>[];
}