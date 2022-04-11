import { emit, eventBus } from "../lib/eventBus";
import utlis, { expr2xy, stringAt, xy2expr } from "../lib/util";
import Artboard from "./artboard";
import Cell, { Cells } from "./cell";
import SheetData, { ColMetas, RowMeta, RowMetas } from "./model/sheet.data";
import Options from "./options";
import Scrollbar from "./scrollbar";
import Sheet from "./sheet";



enum MouseState {
  UP = 0,
  DOWN = 1,
  MOVE = 2,
  DOWN_MOVE = 3
}

/**
 * 窗口概念，只针对窗口进行上下左右滑动
 * 窗口 top， left 边缘依附 Scrollbar 
 * 利用 translate 让画布内嵌固定的 宽高，使得 单元格开始为 0，0 坐标，
 * Scrollbar 的坐标为 负 坐标开始到 0 坐标
 * 
 * 滚动窗口动态渲染需要渲染的块，自然就不需要疯狂调用 translate 改变画布导致 clear 发生一些奇怪的问题
 * 
 * 窗口大小就是 canvas 的大小
 * 
 * @Params cells 松散结构，为了可以直接从里面获得某一列，或者某一行，直接通过 key 去匹配，
 * A 列 或者 1 行 
 * 考虑过 Array 行 内组合 cells Array 的结构，可是这样子难以获取某一列的数据集
 * 若行模式和列模式共存也太浪费空间资源了
 */
export default class SlideWindow {
  private readonly scrollbar: Scrollbar;

  private width: number = 0;
  private height: number = 0;

  // 横向窗口显示开始坐标 ABCD X 轴
  private horizontalShowStartIndex: number = 0
  // 横向窗口显示结束坐标 
  private horizontalShowEndIndex: number = 0
  private horizontalEnd: boolean = false

  // 纵向窗口显示开始坐标 1234 Y 轴
  private verticalShowStartIndex: number = 0
  // 纵向窗口显示结束坐标  
  private verticalShowEndIndex: number = 0
  private verticalEnd: boolean = false

  private readonly showCells: Cells = {}


  private get showColMetas(): ColMetas {
    const colMetas: ColMetas = {}
    for (let index = this.horizontalShowStartIndex; index <= this.horizontalShowEndIndex; index++) {
      const colMeta = this.sheetData.colMetas[index];
      colMetas[index] = colMeta || { width: this.options.defaultCellWidth }
      if (!colMeta) this.sheetData.colMetas[index] = colMetas[index]
    }
    return colMetas
  }
  private get showRowMetas(): RowMetas {
    const rowMetas: RowMetas = {}
    for (let index = this.verticalShowStartIndex; index <= this.verticalShowEndIndex; index++) {
      const rowMeta: RowMeta = this.sheetData.rowMetas[index];
      rowMetas[index] = rowMeta || { height: this.options.defaultCellHeight }
      if (!rowMeta) this.sheetData.rowMetas[index] = rowMetas[index]
    }
    return rowMetas
  }


  private mouseState: MouseState = MouseState.UP

  private horizontalTargetKey: number | undefined
  private verticalTargetKey: number | undefined

  constructor(
    private readonly sheet: Sheet,
    private readonly artboard: Artboard,
    private readonly sheetData: SheetData,
    private readonly cells: Cells,
    private readonly options: Options
  ) {
    this.scrollbar = new Scrollbar(artboard, sheetData, options)
    this.resize()


    this.sheet.on('mousemove', (event: any) => {
      if ((this.mouseState | MouseState.MOVE) === MouseState.DOWN_MOVE)
        this.mouseDownMove(event)
      else
        this.mousemove(event)
    })
    this.sheet.on('mousedown', this.mousedown())
    this.sheet.on('mouseup', this.mouseup())

    eventBus.on('artboard-resize', _ => {
      this.resize()
    })
      .on("table-click", event => {
        let { offsetX, offsetY } = event
        offsetX = offsetX - this.options.scrollbarVerticalWidth
        offsetY = offsetY - this.options.scrollbarHorizontalHeight
        if (offsetX < 0 || offsetY < 0) return
        this.clickCell(offsetX, offsetY)
      })
  }

  mousedown() {
    return (event: MouseEvent | any) => {
      this.mouseState = MouseState.DOWN
    }
  }

  mouseup() {
    return (event: MouseEvent | any) => {
      this.mouseState = MouseState.UP
      if (this.sheet.cursor !== 'default')
        this.sheet.cursor = 'default'
    }
  }

  mouseDownMove(event: MouseEvent | any) {
    const { offsetX, offsetY } = event
    if (utlis.isDefined(this.horizontalTargetKey)) {
      const item = this.sheetData.colMetas[this.horizontalTargetKey!]
      const width = offsetX - (item.width + item.x! + this.options.scrollbarVerticalWidth)
      item.width += width
      if (item.width < this.options.cellMinWidth) item.width = this.options.cellMinWidth
      this.redraw()
      return
    }
    if (utlis.isDefined(this.verticalTargetKey)) {
      const item = this.sheetData.rowMetas[this.verticalTargetKey!]
      const height = offsetY - (item.height + item.y! + this.options.scrollbarHorizontalHeight)
      item.height += height
      if (item.height < this.options.cellMinHeight) item.height = this.options.cellMinHeight
      this.redraw()
      return
    }
    console.log(event, "mouseDownMove")
  }

  mousemove(event: MouseEvent | any) {
    let { offsetX, offsetY } = event
    if (this.sheet.cursor !== 'default')
      this.sheet.cursor = 'default'
    if (offsetX > this.options.scrollbarVerticalWidth && offsetY < this.options.scrollbarHorizontalHeight) {
      const targetKey = Object.keys(this.scrollbar.horizontalMeta)
        .map(key => Number(key))
        .find(key => {
          const item = this.scrollbar.horizontalMeta[key]
          return Math.abs(item.width + item.x! + this.options.scrollbarVerticalWidth - offsetX) <= 2
        })
      console.log(targetKey)
      if (!utlis.isDefined(targetKey)) return
      this.sheet.cursor = 'col-resize'
      this.horizontalTargetKey = targetKey
      return
    }
    this.horizontalTargetKey = undefined

    if (offsetX < this.options.scrollbarVerticalWidth && offsetY > this.options.scrollbarHorizontalHeight) {
      const targetKey = Object.keys(this.scrollbar.verticalMeta)
        .map(key => Number(key))
        .find(key => {
          const item = this.scrollbar.verticalMeta[key]
          return Math.abs(item.height + item.y! + this.options.scrollbarHorizontalHeight - offsetY) <= 2
        })
      if (!utlis.isDefined(targetKey)) return
      this.sheet.cursor = 'row-resize'
      this.verticalTargetKey = targetKey
      return
    }
    this.verticalTargetKey = undefined
  }


  clickCell(offsetX: number, offsetY: number) {
    const cellLiet = Object.keys(this.showCells).map(addr => this.showCells[addr])
    let maxAddr = cellLiet[0].Addr
    const [oneX, oneY] = expr2xy(maxAddr)
    let maxAddrSum = oneX + oneY

    cellLiet.filter(cell => {
      return cell.X <= offsetX && cell.Y <= offsetY
    })
      .forEach(cell => {
        const [x, y] = expr2xy(cell.Addr)
        const addSum = x + y
        if (addSum > maxAddrSum) {
          maxAddrSum = addSum
          maxAddr = cell.Addr
        }
      })
    this.redraw()
    this.sheet.input.closeInput()
    emit("click-cell", maxAddr, this.showCells[maxAddr])
  }

  resize() {
    this.artboard.translate(this.options.scrollbarVerticalWidth, this.options.scrollbarHorizontalHeight)
    this.horizontalShowStartIndex = 0
    this.verticalShowStartIndex = 0
    this.width = this.artboard.clientWidth - this.options.scrollbarVerticalWidth
    this.height = this.artboard.clientHeight - this.options.scrollbarHorizontalHeight
    this.horizontalShowEndIndex = this.calcHorizontalEndIndex()
    this.verticalShowEndIndex = this.calcVerticalEndIndex()
    this.redraw()
  }

  /**
   * 滑动几个单位，一个单位就是一行或者一列
   * @param x 横行
   * @param y 纵向
   */
  slide(x: number, y: number) {

    if (x > 0 && this.horizontalEnd) x = 0
    if (y > 0 && this.verticalEnd) y = 0

    this.horizontalShowStartIndex += x
    this.verticalShowStartIndex += y
    if (this.horizontalShowStartIndex === 0 && this.verticalShowStartIndex === 0) return

    if (this.horizontalShowStartIndex < 0) this.horizontalShowStartIndex = 0
    if (this.verticalShowStartIndex < 0) this.verticalShowStartIndex = 0
    this.horizontalShowEndIndex = this.calcHorizontalEndIndex()
    this.verticalShowEndIndex = this.calcVerticalEndIndex()
    this.redraw()
  }

  clear(): SlideWindow {
    this.artboard.clear(-(this.options.scrollbarVerticalWidth), -(this.options.scrollbarHorizontalHeight))
    return this
  }

  redraw(): SlideWindow {
    this.sheet.input.closeInput()
    return this.clear().render()
  }

  render(): SlideWindow {
    this.scrollbar
      .renderZeroPoint()
      .renderHorizontal(this.showColMetas)
      .renderVertical(this.showRowMetas)
    this.initShowCells()
      .renderCell()
    return this
  }


  renderCell(): SlideWindow {
    const cells = Object.keys(this.showCells).map(key => this.showCells[key])
    cells.forEach(cell => cell.render())
    this.options.showGrid && cells.forEach(cell => cell.renderGrid())
    return this
  }


  initShowCells(): SlideWindow {
    Object.keys(this.scrollbar.horizontalMeta).forEach(colIndex => {
      const colMeta = this.scrollbar.horizontalMeta[Number(colIndex)]
      Object.keys(this.scrollbar.verticalMeta).forEach(rowIndex => {
        const rowMeta = this.scrollbar.verticalMeta[Number(rowIndex)]
        const addr = xy2expr(Number(colIndex), Number(rowIndex))
        const cell: Cell = this.cells[addr]
        cell.init(colMeta.x!, rowMeta.y!, colMeta.width, rowMeta.height)
        this.showCells[addr] = cell
      })
    })
    return this
  }

  private calcHorizontalEndIndex(): number {
    let width = 0
    for (let colIndex = this.horizontalShowStartIndex; colIndex < this.sheetData.colMetas.count; colIndex++) {
      const colMeta = this.sheetData!.colMetas[colIndex];
      width += colMeta?.width || this.options.defaultCellWidth
      if (width > this.width) {
        this.horizontalEnd = false
        return colIndex
      }
    }
    this.horizontalEnd = true
    return this.sheetData.colMetas.count - 1
  }

  private calcVerticalEndIndex(): number {
    let height = 0
    for (let rowIndex = this.verticalShowStartIndex; rowIndex < this.sheetData.rowMetas.count; rowIndex++) {
      const rowMeta = this.sheetData!.rowMetas[rowIndex];
      height += rowMeta?.height || this.options.defaultCellHeight
      if (height > this.height) {
        this.verticalEnd = false
        return rowIndex
      }
    }
    this.verticalEnd = true
    return this.sheetData.rowMetas.count - 1
  }

}