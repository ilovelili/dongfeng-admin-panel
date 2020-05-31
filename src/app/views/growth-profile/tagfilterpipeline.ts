import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagFilter'
})
export class TagFilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row => {
        if (!row.tags) return false
        return row.tags.indexOf(query) > -1;
      });
    }
    return array;
  }
}