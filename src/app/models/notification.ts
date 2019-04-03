export class Notifications {
  notifications: Notification[];
}

export class Notification {
  constructor(
    public id: number,
    public user_id: string,
    public custom_code: string,
    public category: string,
    public category_id: number,
    public details: string,
    public link: string,
    public time: string,
    public read: boolean = false) { }

  // parse details by customcode and detail info
  get Detail(): string {
    let result = "";
    switch (this.custom_code) {
      case "N1001":
        result = DetailPlaceHolder.ProfileUpdated;
        break;
      case "N1002":
        result = DetailPlaceHolder.NamelistUpdated;
        break;
      case "N1003":
        result = DetailPlaceHolder.ClasslistUpdated;
        break;
      case "N1004":
        result = DetailPlaceHolder.TeacherlistUpdated;
        break;
      case "N1005":
        result = DetailPlaceHolder.AttendanceUpdated;
        break;
      case "N2001":
        result = DetailPlaceHolder.PhysiqueUpdated;
        break;
      case "N5001":
        result = DetailPlaceHolder.RecipeUpdated;
        break;
      case "N5002":
        result = DetailPlaceHolder.MenuUpdated;
        break;
      case "N5003":
        result = DetailPlaceHolder.IngredientUpdated;
        break;
      case "N6001":
        result = DetailPlaceHolder.AttendanceUpdated;
        break;
      default:
        break;
    }

    return result.
      replace(/{{time}}/g, this.formatDate(this.time));
  }

  get Link(): string {
    return this.link || "#";
  }

  get Title(): string {
    let title = this.category;
    if (this.custom_code != "N7001") {
      return title;
    }

    JSON.parse(this.details, (key, value) => {
      if (key == "title") {
        title = value;
      }
    });
    return title;
  }

  get Content(): string {
    let content = this.Detail;
    if (this.custom_code != "N7001") {
      return content;
    }

    JSON.parse(this.details, (key, value) => {
      if (key == "content") {
        content = `${this.formatDate(this.time)} ${value}`;
      }
    });
    return content;
  }

  private formatDate(date: string, exacttime = true) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minute = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (!exacttime) {
      return [year, month, day].join('-');
    }
    return [year, month, day].join('-') + ' ' + [hour, minute].join(':');
  }
}

class DetailPlaceHolder {
  static ProfileUpdated: string = "{{time}} 用户信息更新";
  static NamelistUpdated: string = "{{time}} 班级名单更新";
  static ClasslistUpdated: string = "{{time}} 班级信息更新";
  static TeacherlistUpdated: string = "{{time}} 教师信息更新";
  static PhysiqueUpdated: string = "{{time}} 体格信息表更新";
  static RecipeUpdated: string = "{{time}} 菜谱信息更新";
  static MenuUpdated: string = "{{time}} 菜单信息更新";
  static IngredientUpdated: string = "{{time}} 配菜信息更新";
  static AttendanceUpdated: string = "{{time}} 点名信息更新";
  static AgentSmith: string = "{{time}} {{title}}{{details}}";
}
