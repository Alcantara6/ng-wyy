import { ServicesModule, API_CONFIG } from './services.module';
import { Injectable, Inject } from '@angular/core';
import { SongSheet, Song } from './data-types/common.types';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from './song.service';



@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe: SongService
  ) { }

  /** yj: 获取歌单详情 */
  // new HttpParams.set方法
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params })
    .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  /** 点击歌单，获取歌单详情（含有的歌曲tracks） */
  // 接口设计值得商榷，tracks中直接提供url，就不需要再去调接口组装url了
  playSheet(id: number): Observable<Song[]> {
    /** pluck, switchMap操作符 */
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'), switchMap(tracks => this.songServe.getSongList(tracks)));
  }
}
