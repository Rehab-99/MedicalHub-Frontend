import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private isBrowser: boolean;
  private toastr: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      import('ngx-toastr').then(module => {
        this.toastr = module.default;
      });
    }
  }

  success(message: string, title: string = 'Success') {
    if (this.isBrowser && this.toastr) {
      this.toastr.success(message, title);
    }
  }

  error(message: string, title: string = 'Error') {
    if (this.isBrowser && this.toastr) {
      this.toastr.error(message, title);
    }
  }

  info(message: string, title: string = 'Info') {
    if (this.isBrowser && this.toastr) {
      this.toastr.info(message, title);
    }
  }

  warning(message: string, title: string = 'Warning') {
    if (this.isBrowser && this.toastr) {
      this.toastr.warning(message, title);
    }
  }
} 