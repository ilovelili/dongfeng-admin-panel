import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row =>
        row.recipe.indexOf(query) > -1 ||
        row.breakfast_or_lunch_str.indexOf(query) > -1 ||
        row.junior_or_senior_str.indexOf(query) > -1
      );
    }
    return array;
  }
}
