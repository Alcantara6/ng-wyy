import { ServicesModule, API_CONFIG } from './services.module';
import { Injectable, Inject } from '@angular/core';
import { SongSheet, SongUrl, Song } from './data-types/common.types';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';



@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  /** 根据歌曲id，获取歌曲url */
  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get(this.uri + 'song/url', { params })
    .pipe(map((res: { data: SongUrl[] }) => res.data));
  }


  /** 根据歌曲id，获取歌曲url，并把url拼接到歌曲对象中 */
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');
    return this.getSongUrl(ids).pipe(
      map(urls => this.generateSongList(songArr, urls))
    );
    // 优化代码，map操作符即可
    return Observable.create(observer => {
      this.getSongUrl(ids).subscribe(urls => {
        observer.next(this.generateSongList(songArr, urls));
      });
    });

  }

  /** 把歌曲url拼接到歌曲对象中 */
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(url => url.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    return result;
  }
}
