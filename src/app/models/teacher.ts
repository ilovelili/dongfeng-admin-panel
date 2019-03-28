export class TeacherList {
    constructor(public items: TeacherListItem[]){}
    
    get FormattedTeacherList(): FormattedTeacherList {
      let items: FormattedTeacherListItem[] = [];
      if (!this.items) {
        return {
          items: items,
        }
      }
  
      this.items.forEach(i => {
        i.items.forEach(teacher => {
          items.push({
            year: i.year,
            id: teacher.id,
            name: teacher.name,
            class: teacher.class,
            email: teacher.email,
            role: this.resolveRole(teacher.role),
          });
        });
      });
  
      return {
        items: items,
      }
    }

    private resolveRole(role: string): string {
      if (role == "admin") {
        return "管理员";
      }
      return "普通用户";
    }
  }
  
  export class TeacherListItem {
    year: string;    
    items: TeacherItem[];
  }
  
  class TeacherItem {
    id: number;
    name: string;
    class: string[];
    email: string;
    role: string;
  }
  
  export class FormattedTeacherList {
    items: FormattedTeacherListItem[];
  }
  
  export class FormattedTeacherListItem {
    year: string;
    id: number;
    name: string;
    class: string[];
    email: string;
    role: string;
  }