import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row =>        
        row.year.indexOf(query) > -1 ||
        row.class.indexOf(query) > -1 ||
        row.name.indexOf(query) > -1 ||
        row.date.indexOf(query) > -1
      );
    }
    return array;
  }
}