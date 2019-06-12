export class Ebooks {
    constructor(public ebooks: Ebook[]) { }
      
    empty(): boolean {
      return !this || !this.ebooks || !this.ebooks.length;
    }
  }  
  
  export class Ebook {    
    year: string;
    class: string;
    name: string;
  }
  