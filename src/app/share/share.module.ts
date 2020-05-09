import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';


// yj: 项目各个地方都会用到，导入的Module需要导出，别处使用
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
  ]
})
export class ShareModule { }
