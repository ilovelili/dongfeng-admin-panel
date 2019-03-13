export class NameList {
  items: NameListItem[];

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
          name: name,
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
  names: string[];
}

export class FormattedNameList {
  items: FormattedNameListItem[];
}

export class FormattedNameListItem {
  year: string;
  class: string;
  name: string;
}