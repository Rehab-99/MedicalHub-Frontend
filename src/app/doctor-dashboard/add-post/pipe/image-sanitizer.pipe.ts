import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'imageSanitizer'
})
export class ImageSanitizerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeHtml {
    if (!html) return '';

    console.log('ImageSanitizer - Original HTML:', html);

    let processedHtml = html.replace(/<img([^>]+)src="([^"]+)"([^>]*)>/gi, (match, pre, src, post) => {
      let fixedSrc = src;

      // لو المسار فيه storage، نضيف http://127.0.0.1:8000
      if (src.includes('storage/')) {
        fixedSrc = src.replace(/^\/?storage\//, 'http://127.0.0.1:8000/storage/');
      }

      console.log('ImageSanitizer - Image src:', src, '->', fixedSrc);

      // الحفاظ على الـ style أو إضافته لو مش موجود
      const styleMatch = post.match(/style="([^"]*)"/);
      const style = styleMatch ? styleMatch[0] : 'style="max-width:100%; height:auto;"';

      return `<img${pre} src="${fixedSrc}" ${style} ${post.replace(/style="[^"]*"/, '')}>`;
    });

    console.log('ImageSanitizer - Processed HTML:', processedHtml);

    return this.sanitizer.bypassSecurityTrustHtml(processedHtml);
  }
}