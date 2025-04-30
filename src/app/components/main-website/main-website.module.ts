import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainWebsiteLayoutComponent } from './main-website-layout/main-website-layout.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    MainWebsiteLayoutComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MainWebsiteLayoutComponent
  ]
})
export class MainWebsiteModule { } 