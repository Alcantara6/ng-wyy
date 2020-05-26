import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

// yj: 后端请求服务中不一定就只是调用api返回结果，可以有一定的数据预先处理
@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  // yj: 使用@Inject指定自定义提供者
  // 自定义提供者让你可以为隐式依赖提供一个具体的实现，比如内置浏览器 API
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
    .pipe(map((res: { banners: Banner[] }) => res.banners));
  }


  /** yj: 获取歌单类型：流行、摇滚... */
  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot')
      .pipe(map((res: { tags: HotTag[] }) => {
        return res.tags.sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5);
      }));
  }

  /** yj: 获取歌单列表 */
  getPerosonalSheetList(): Observable<SongSheet[]> {
    return this.http.get(this.uri + 'personalized')
      .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
  }
}
