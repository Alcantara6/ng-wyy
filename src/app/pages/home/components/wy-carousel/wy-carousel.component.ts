import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush  // yj：变更检测策略，简单组件，只在输入属性变化时检测组件树
})
export class WyCarouselComponent implements OnInit {
  @Input() activeIndex = 0;

  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();

  // yj: 使用ViewChild访问ng-template
  // yj: static为true，表示在变更检测前获取。如果ng-template有ngif等动态生成，需要在变更检测后获取，则static应为false
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

  // yj: 字符串联合类型
  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type);
  }

}
