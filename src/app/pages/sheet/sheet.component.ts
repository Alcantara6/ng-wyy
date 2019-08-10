import { Component, OnInit } from '@angular/core';
import { SheetService, SheetParams } from 'src/app/service/sheet/sheet.service';
import { SongSheet, playlistInfo } from '../../service/data-modals/common.models';
import { SongService } from 'src/app/service/song/song.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.less']
})
export class SheetComponent implements OnInit {
  radioValue = 'hot';
  private listParams: SheetParams = {
    cat: '全部',
    limit: 35,
    offset: 1,
    order: 'hot'
  }

  playlistInfo: playlistInfo;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private songServe: SongService,
    private multipleReducerServe: MultipleReducersService) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {
  }

  orderChange(order: 'new' | 'hot') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getList();
  }

  onPageChange(page: number) {
    this.listParams.offset = page;
    this.getList();
  }

  playSong(id: number) {
    this.sheetServe.getSongSheetDetail(id).subscribe(sheet => {
      this.songServe.getSongList(sheet.tracks).subscribe(list => {
        if (list.length) {
          this.multipleReducerServe.selectPlay(({ list, index: 0 }));
        }
      });
    });
  }

  private getList() {
    this.sheetServe.getSheetList(this.listParams).subscribe(res => this.playlistInfo = res);
  }
  
  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  trackBySongList(index: number, songSheet: SongSheet): number { return songSheet.id; }
}
