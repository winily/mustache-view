import lodash from 'lodash'
import { xy2expr } from '../lib/util'
import Artboard from './artboard'
import SheetData from './model/sheet.data'
import Options from './options'
import Cell, { Cells } from './cell'
import CellData from './model/cell.data'
import SlideWindow from './slideWindow'
import VirtualElement from '../lib/virtualElement'
import EventBus from '../lib/eventBus'
import Input from './input'


export default class Sheet extends VirtualElement<'div'> {
  private slideWindow: SlideWindow | undefined
  public artboard: Artboard | undefined
  public readonly input: Input

  private data: Cells;

  constructor(
    private readonly sheetData: SheetData,
    private readonly eventBus: EventBus,
    private readonly options: Options
  ) {
    super('div', 'mustache-sheet')
    this.data = this.initData()
    this.input = new Input()
    this.child(this.input)
  }

  render(): Sheet {
    this.artboard = new Artboard(this.el.clientWidth, this.el.clientHeight, this.eventBus)
    this.child(this.artboard)
    this.el.addEventListener("click", e => this.click(e))
    this.on("mousewheel", (evt: Event) => this.mousewheel(evt))
    this.observerSize()
    this.slideWindow = new SlideWindow(
      this,
      this.artboard,
      this.sheetData,
      this.data,
      this.eventBus,
      this.options
    )
    return this
  }

  redraw(): Sheet {
    this.slideWindow?.redraw()
    return this
  }

  get maxWidth() {
    let maxWidth = 0
    for (let colIndex = 0; colIndex < this.sheetData!.colMetas.count; colIndex++) {
      const colMeta = this.sheetData!.colMetas[colIndex];
      maxWidth += colMeta?.width || this.options.defaultCellWidth
    }
    return maxWidth
  }

  get maxHeight() {
    let maxHeight = 0
    for (let rowIndex = 0; rowIndex < this.sheetData!.rowMetas.count; rowIndex++) {
      const rowMeta = this.sheetData!.rowMetas[rowIndex];
      maxHeight += rowMeta?.height || this.options.defaultCellHeight
    }
    return maxHeight
  }

  mousewheel(event: WheelEvent | any) {
    const { wheelDeltaX, wheelDeltaY } = event
    let offsetX = wheelDeltaX === 0 ? 0 : wheelDeltaX < 0 ? 1 : -1;
    let offsetY = wheelDeltaY === 0 ? 0 : wheelDeltaY < 0 ? 1 : -1;
    this.slideWindow!.slide(offsetX, offsetY)
  }

  click(event: Event) {
    this.eventBus.emit('table-click', event)
  }

  observerSize() {
    const iframe = new VirtualElement('iframe', 'mustache-observer-size-iframe')
    this.child(iframe)
    const resize = lodash.debounce(() => {
      this.artboard!.resize(this.el.clientWidth, this.el.clientHeight - 42)
    }, 50)
    window.addEventListener('resize', resize)
  }

  private initData(): Cells {
    const data: Cells = {}
    for (let rowIndex = 0; rowIndex < this.sheetData!.rowMetas.count; rowIndex++) {
      for (let colIndex = 0; colIndex < this.sheetData!.colMetas.count; colIndex++) {
        const addr = xy2expr(colIndex, rowIndex)
        if (!this.sheetData.cells[addr]) this.sheetData.cells[addr] = { addr, value: "" }
        const cell: CellData = this.sheetData.cells[addr]
        data[addr] = new Cell(cell, this, this.eventBus, this.options)
      }
    }
    return data
  }
}