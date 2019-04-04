export class Teachers {
    constructor(public teachers: Teacher[]){}

    format(): Teachers {
      let result: Teacher[] = [];
      if (this.empty()) {
        return this;
      }

      this.teachers.forEach(t => {        
        t.role = this.resolveRole(t);
        result.push(t);
      })

      return new Teachers(result);
    }

    empty(): boolean {
      return !this || !this.teachers || this.teachers.length == 0;
    }

    private resolveRole(teacher: Teacher): string {
      if (teacher && teacher.role == "admin") {
        return "管理员";
      }
      return "普通用户";
    }
  }
  
  export class Teacher {
    id: number;
    year: string;    
    name: string;
    class: string;
    email: string;
    role: string;
  }
  