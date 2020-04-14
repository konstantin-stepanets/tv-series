import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'genrePipe'})

export class GenrePipe implements PipeTransform {
  transform(value): string {
    switch (value) {
      case 'drama':
        return 'drama-genre';
        break;
      case 'comedy':
        return 'comedy-genre';
        break;
      case 'dark comedy':
        return 'dark-comedy-genre';
        break;
      case 'horror':
        return 'horror-genre';
        break;
      case 'crime':
        return 'crime-genre';
        break;
      default:
        return 'default';
    }
  }
}
