export class ProfileTemplates {
    constructor(public templates: ProfileTemplate[]) { }
    empty(): boolean {
        return !this || !this.templates || !this.templates.length;
    }
}

export class ProfileTemplate {    
    name: string;
    created_by: string;
}