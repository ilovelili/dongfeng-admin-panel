import { Pupil } from "./pupil";

export class Profile {
    constructor(
        public id: number,
        public date: string,
        public pupil?: Pupil,
        public pupil_id?: number,
        public template?: ProfileTemplate,
        public template_id?: number
    ) { }

    get className(): string {
        return this.pupil.class.name;
    }

    get classId(): number {
        return this.pupil.class.id;
    }

    get pupilName(): string {
        return this.pupil.name;
    }

    get pupilId(): number {
        return this.pupil_id;
    }

    get templateId(): number {
        return this.template_id;
    }
}

export class ProfileTemplate {
    constructor(
        public id: number,
        public name: string,
        public created_by: string,
        public tags?: string,
    ) { }
}

export class ProfileCount {
    constructor(
        public pupilId: number,
        public pupil: string,
        public cls: string
    ) { }

    format(date: string): string {
        return date + " " + this.cls + " " + this.pupil;
    }
}