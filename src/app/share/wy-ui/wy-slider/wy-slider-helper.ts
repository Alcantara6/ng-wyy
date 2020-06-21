export function sliderEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

/** Js原生方式获取元素相对文档的位置 */
export function getElementOffset(el: HTMLElement): { top: number; left: number; } {
  // getClientRects与块状、内联元素有关，不深究 https://segmentfault.com/q/1010000002559120
  if (!el.getClientRects().length) {
    return {
      top: 0,
      left: 0
    }
  }

  const rect = el.getBoundingClientRect();
  // yj: ownerDocument: 此属性返回的 document 对象是在实际的HTML文档中的所有子节点所属的主对象。如果在文档节点自身上使用此属性，则结果是null。
  // yj: defaultView: 在浏览器中，该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。
  // IE9以下不兼容defaultView
  // 这里的非空断言感觉讲得有点问题，不用看，以Angular文档为准
  const win = el.ownerDocument!.defaultView;

  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  }
}

