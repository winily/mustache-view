export default class VirtualElement<K extends keyof HTMLElementTagNameMap> {
  protected readonly el: HTMLElementTagNameMap[K]

  constructor(key: K | HTMLElementTagNameMap[K], className: string = "") {
    if (typeof key === 'string')
      this.el = document.createElement(key)
    else
      this.el = key
    this.el.className = className
  }

  get inputValue() {
    if (this.el instanceof HTMLInputElement
      || this.el instanceof HTMLTextAreaElement)
      return this.el.value
    return ""
  }

  set inputValue(val: string) {
    if (this.el instanceof HTMLInputElement
      || this.el instanceof HTMLTextAreaElement)
      this.el.value = val
  }

  get innerText() {
    return this.el.innerText
  }

  set innerText(val: string) {
    this.el.innerText = val
  }

  get innerHTML() {
    return this.el.innerHTML
  }

  set innerHTML(val: string) {
    this.el.innerHTML = val
  }


  get className() {
    return this.el.className
  }

  set className(val: string) {
    this.el.className = val
  }

  get style() {
    return this.el.style
  }

  set cursor(style: CursorStyle) {
    this.style.cursor = style
  }

  get cursor(): CursorStyle {
    return this.style.cursor as CursorStyle
  }

  on(eventName: string, callback: Function) {
    this.el.addEventListener(eventName, (event) => {
      callback(event)
    })
  }

  child(el: Element | VirtualElement<keyof HTMLElementTagNameMap>): VirtualElement<K> {
    if (el instanceof VirtualElement)
      this.el.appendChild(el.el)
    else
      this.el.appendChild(el)
    return this
  }

  children(...els: Array<Element | VirtualElement<keyof HTMLElementTagNameMap>>): VirtualElement<K> {
    els.forEach(item => this.child(item))
    return this
  }

  attr(key: string, value: any): VirtualElement<K> {
    this.el.setAttribute(key, value);
    return this;
  }

  removeAttr(key: string): VirtualElement<K> {
    this.el.removeAttribute(key);
    return this;
  }

  focus(): VirtualElement<K> {
    this.el.focus()
    return this
  }

  display(display: boolean): VirtualElement<K> {
    this.el.style.display = !display ? 'block' : 'none'
    return this
  }
}


export type CursorStyle = 'col-resize' | 'row-resize' | 'pointer' | 'default'