import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None  // CSS样式作用于内部组件
})
export class WySliderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
