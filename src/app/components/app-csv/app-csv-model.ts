export class CsvEntity {
    Headers: string[];
    Rows: CsvRecord[]
}

export class CsvRecord {
    Items: string[]
}

export class CsvFormat {
    constructor(public Headers: string[], public Columns: string[]) { }
}