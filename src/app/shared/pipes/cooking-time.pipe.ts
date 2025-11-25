import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cookingTime',
  standalone: true
})
export class CookingTimePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '-';

    let minutes: number;

    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) return value;
      minutes = parsed;
    } else {
      minutes = value;
    }

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return mins ? `${hours}h ${mins}min` : `${hours}h`;
  }
}
