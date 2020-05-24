import { NgModule, InjectionToken } from '@angular/core';

// yj: 使用@Inject指定自定义提供者
// 自定义提供者让你可以为隐式依赖提供一个具体的实现，比如内置浏览器 API
export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    { provide: API_CONFIG, useValue: 'http://localhost:3000/' }
  ]
})
export class ServicesModule { }
