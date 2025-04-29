import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'Unknown time';

    const now = new Date();
    const date = new Date(value);
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return `منذ ${diffSeconds} second`;
    } else if (diffMinutes < 60) {
      return `منذ ${diffMinutes} minute`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} hour`;
    } else if (diffDays === 1) {
      return 'أمس';
    } else {
      return new DatePipe('en-US').transform(value, 'dd MMM yyyy') || 'Unknown date';
    }
  }
}