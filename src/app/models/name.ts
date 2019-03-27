export class NameList {
  constructor(public items: NameListItem[]){}
  
  get FormattedNameList(): FormattedNameList {
    let items: FormattedNameListItem[] = [];
    if (!this.items) {
      return {
        items: items,
      }
    }

    this.items.forEach(i => {
      i.names.forEach(name => {
        items.push({
          year: i.year,
          class: i.class,
          id: name.id,
          name: name.name,
        });
      });
    });

    return {
      items: items,
    }
  }
}

export class NameListItem {
  year: string;
  class: string;
  names: NameItem[];
}

class NameItem {
  id: number;
  name: string;
}

export class FormattedNameList {
  items: FormattedNameListItem[];
}

export class FormattedNameListItem {
  year: string;
  class: string;
  id: number;
  name: string;  
}