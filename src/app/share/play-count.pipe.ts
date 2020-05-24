import { Pipe, PipeTransform } from '@angular/core';
/** 项目各处会用到的管道 */
@Pipe({
  name: 'playCount'
})
export class PlayCountPipe implements PipeTransform {

  transform(value: number): number | string {
    if (value > 10000) {
      return Math.floor(value / 10000) + '万';
    } else {
      return value;
    }
  }
}
