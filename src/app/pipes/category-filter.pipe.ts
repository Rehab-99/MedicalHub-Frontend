import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter',
  standalone: true
})
export class CategoryFilterPipe implements PipeTransform {
  transform(categories: any[] | null, type: string): any[] {
    if (!categories) return [];
    return categories.filter(category => category.type === type);
  }
} 