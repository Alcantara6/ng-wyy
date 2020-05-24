export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
}


export type HotTag = {
  id: number;
  name: string;
  /** 越小，位置越靠前 */
  position: number;
}


// 歌单
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
}


// 歌手
export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}
