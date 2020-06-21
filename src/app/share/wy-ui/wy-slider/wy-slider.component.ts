import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent, getElementOffset } from './wy-slider-helper';
import { inArray } from 'src/app/utils/array';
import { limitNumberInRange, getPercent } from 'src/app/utils/number';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,  // CSS样式作用于内部组件
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit, OnDestroy {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;


  private sliderDom: HTMLDivElement;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStart_: Subscription | null;
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;
  private isDragging = false;

  sliderValue: SliderValue = null;   // 实际的移动距离（作为成员变量，主要是用于新值和旧值的比较）
  sliderOffsetPercent: SliderValue = null;  // 移动相对距离（相对总长100）

  // yj: 另一种获取DOM的方式
  // constructor(private el: ElementRef) {}
  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // console.log(this.el.nativeElement);
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables() {
    // yj: 鼠标位置相对文档的位置
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };


    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filerFunc, pluckKey } = source;

      source.startPlucked$ = fromEvent(this.sliderDom, start)
      .pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),  // yj: 新版rxjs废弃pluck，使用map
        map((position: number) => this.findClosestValue(position))
      );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey), // yj: 新版rxjs废弃pluck，使用map
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)  // 这是停止发射。与取消订阅还是两码事。
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }


  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }


  private unsubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (inArray(events, 'move') && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (inArray(events, 'end') && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private onDragStart(sliderValue: number) {
    this.toggleDragMoving(true);
    this.setValue(sliderValue);

  }
  private onDragMove(sliderValue: number) {
    if (this.isDragging) {
      this.setValue(sliderValue);
      this.cdr.markForCheck();  // yj: onPush策略适用（应该是offset值设置后执行吧，与模板绑定相关）
    }
  }
  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();  // yj: onPush策略适用（应该是offset值设置后执行吧，与模板绑定相关）
  }


  private setValue(sliderValue: SliderValue) {
    if (!this.valuesEqual(this.sliderValue, sliderValue)) {
      this.sliderValue = sliderValue;
      this.updateTrackAndHandles();
    }

  }

  private valuesEqual(valA: SliderValue, valB: SliderValue): boolean {
    if (typeof valA !== typeof valB) {
      return false;
    }
    return valA === valB;
  }


  private updateTrackAndHandles() {
    this.sliderOffsetPercent = this.getValueToOffset(this.sliderValue);
    this.cdr.markForCheck();  // yj: 手动执行变更检测，ChangeDetectorRef对象
  }


  private getValueToOffset(sliderValue: SliderValue): SliderValue {
    return getPercent(this.wyMin, this.wyMax, sliderValue);  // 25%，则返回值25
  }

  private toggleDragMoving(movable: boolean) {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    }else {
      this.unsubscribeDrag(['move', 'end']);
    }
  }


  private findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();

    // 滑块(左, 上)端点相对文档的位置
    const sliderStart = this.getSliderStartPosition();

    // 滑块当前位置 / 滑块总长
    // yj: position - sliderStart是当前相对于滑块（左/上）端点位置
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    // 纵向处理
    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }


  private getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  /** 获取滑块当前移动距离（相对于滑轨左/上角） */
  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }


  ngOnDestroy(): void {
    this.unsubscribeDrag();
  }
}
