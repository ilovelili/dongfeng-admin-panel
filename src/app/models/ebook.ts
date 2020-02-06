import { Pupil } from "./pupil";

export class Ebook {
    constructor(
        public id: number,
        public pupil: Pupil,
        public pupil_id: number,
        public date: string
    ) { }
    
    get pupilName(): string {
        return this.pupil.name;
    }

    get pupilId(): number {
        return this.pupil_id;
    }

    get className(): string {
        return this.pupil.class.name;
    }

    get classId(): number {
        return this.pupil.class.id;
    }

    static sort(ebooks: Ebook[]): Ebook[] {
        return ebooks.sort((e1, e2): number => {
            let d = new Date(e2.date).getTime() - new Date(e1.date).getTime();
            if (d > 0) return 1;
            if (d < 0) return -1;
            if (e2.className > e1.className) return 1;
            if (e2.className < e1.className) return -1;

            return 0;
        });
    }
}