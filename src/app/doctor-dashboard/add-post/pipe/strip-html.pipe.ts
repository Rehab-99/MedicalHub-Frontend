import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string, maxLength: number = 20): string {
    if (!value) return '';

    // تنظيف الـ HTML وإزالة الـ tags
    const div = document.createElement('div');
    div.innerHTML = value;
    let text = div.textContent || div.innerText || '';

    // تقليم النص للطول المطلوب (20 حرف افتراضي)
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    console.log('StripHtmlPipe - Processed text:', text);
    return text;
  }
}