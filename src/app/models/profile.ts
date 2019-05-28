export class Profiles {
  constructor(public profiles: Profile[]) { }

  format(): FormattedProfile[] {
    let result: FormattedProfile[] = [];
    if (this.empty()) {
      return [];
    }

    let map: ProfileMap[] = [];
    this.profiles.forEach(t => {
      const key = `${t.year}_${t.class}_${t.name}`;
      let idx = map.findIndex(m => m.key == key);
      if (idx > -1) {
        map[idx].value.push(t.date)
      } else {
        map.push({
          key: key,
          value: [t.date],
        });
      }
    });

    map.forEach(item => {      
      let seg = item.key.split('_');
      if (seg.length == 3) {
        let year = seg[0], cls = seg[1], name = seg[2];
        result.push({
          year: year,
          name: name,
          class: cls,
          dates: item.value,
        })
      }
    });

    return result;
  }

  empty(): boolean {
    return !this || !this.profiles || !this.profiles.length;
  }
}

class ProfileMap {
  key: string;
  value: string[];
}

export class Profile {
  id: number;
  year: string;
  name: string;
  class: string;
  date: string;
}

export class FormattedProfile {
  year: string;
  name: string;
  class: string;
  dates: string[];
}
