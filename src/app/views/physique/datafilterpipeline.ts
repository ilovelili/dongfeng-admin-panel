import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row =>        
        row.name.indexOf(query) > -1 ||
        row.class.indexOf(query) > -1 ||
        row.gender.indexOf(query) > -1 ||
        row.birth_date.indexOf(query) > -1 ||
        row.exam_date.indexOf(query) > -1 ||
        row.age.indexOf(query) > -1 ||
        row.height_p.indexOf(query) > -1 ||
        row.height_p.indexOf(query) > -1 ||
        row.height_weight_p.indexOf(query) > -1 ||
        row.conclusion.indexOf(query) > -1
      );
    }
    return array;
  }
}