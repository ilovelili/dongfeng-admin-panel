export class DateRange {
  constructor(public from: string, public to: string) { }
  format(): Date[] {
    let fromDate = this.resolveDate(this.from),
      toDate = this.resolveDate(this.to);

    return [fromDate, toDate];
  }

  private resolveDate(d: string): Date {
    // yyyy/mm/dd or yyyy-mm-dd
    let segments = d.replace("/", "-").split("-");
    if (segments.length != 3) {
      throw 'invalid date';
    }

    let year = parseInt(segments[0]), month = parseInt(segments[1]) - 1 /* since month starts with 0 */, day = parseInt(segments[2]);
    return new Date(year, month, day);
  }
}