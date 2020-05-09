import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { PagesModule } from '../pages/pages.module';
import { ShareModule } from '../share/share.module';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
registerLocaleData(zh);  // yj：配置语言的

// yj: 相当于根模块，只被AppModule引入
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    AppRoutingModule,
  ],
  exports: [
    ShareModule,  // 这里导出，是因为appComponent组件使用了ShareModule中的NgZorroAntdModule
    AppRoutingModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
// yj: 保证只能被AppModule引入
// 这里讲得很不清楚，以下是大概记录，不需要关注！
// 构造函数中注入自己
// 不加装饰器，第一次被AppModule引入，不会进入if，后面如果被其它模块引入，就会报错
// 注入自己，会导致无限循环执行constructor => 加上以下两个装饰器
// 加上SkipSelf(), 第一次被AppModule引入时，构造函数给parentModule赋值时就找不到CoreModule
// 加上@Optional(), 第一次找不到时，Angular只会将服务解析为 null，而不会抛出错误
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被appModule引入');
    }
  }
}
