import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';



@NgModule({
  declarations: [],
  imports: [
    ShareModule  // yj：特性模块使用了共享Module
  ]
})
export class PagesModule { }
