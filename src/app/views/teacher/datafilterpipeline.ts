import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row =>
        row.id == query ||
        row.name.indexOf(query) > -1 ||
        row.className.indexOf(query) > -1 ||
        (row.email && row.email.indexOf(query) > -1) ||
        row.role.indexOf(query) > -1
      );
    }
    return array;
  }
}
