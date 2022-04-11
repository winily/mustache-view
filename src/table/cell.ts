import utli from "../lib/util";
import { Border, BorderBroad, toCoordinateGroup } from "./model/border.type";
import { Box } from "./model/box.type";
import CellData, { CellStyle } from "./model/cell.data";
import Options from "./options";
import { Text } from './model/text.type'
import EventBus from "../lib/eventBus";
import Sheet from "./sheet";

export type Cells = { [key: string]: Cell }

export default class Cell {
  private x: number | null = null
  private y: number | null = null
  private width: number | null = null
  private height: number | null = null

  private checked: boolean = false

  get X(): number { return this.x || 0 }
  get Y(): number { return this.y || 0 }
  get Width(): number { return this.width || 0 }
  get Height(): number { return this.height || 0 }
  get DisplayValue() { return this.cellData.value }
  get Value() { return this.cellData.value }

  get Addr() { return this.cellData.addr }
  get Style(): CellStyle | undefined { return this.cellData.style }

  constructor(
    private readonly cellData: CellData,
    private readonly sheet: Sheet,
    private readonly eventBus: EventBus,
    private readonly options: Options,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
  ) {
    this.x = x || null
    this.y = y || null
    this.width = width || null
    this.height = height || null

    this.eventBus.on("click-cell", addr => this.click(addr))
  }

  setSize(size: number): Cell {
    if (!this.cellData.style) this.cellData.style = {}
    if (!this.cellData.style?.font) this.cellData.style!.font = { size: size }
    else this.cellData.style!.font!.size = size
    this.eventBus.emit('cell-edited')
    this.sheet.redraw()
    return this
  }

  click(addr: string): Cell {
    if (addr === this.Addr) {
      this.renderCheckedBox()
      if (this.checked) {
        this.sheet.input.openInput(this, this.options)
        return this
      }
      this.checked = true
      return this
    }

    this.checked = false
    return this
  }

  updateValue(value: string): Cell {
    this.cellData.value = value
    this.eventBus.emit('cell-edited')
    return this
  }

  init(x: number, y: number,
    width: number, height: number,) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  renderCheckedBox(): Cell {
    const box: Box = {
      x: this.x!, y: this.y!,
      width: this.width!, height: this.height!,
      backColor: this.options.defaultCellCheckedBackColor
    }
    this.sheet.artboard!.strokeBox(box)
    const border: Border = {
      top: {
        coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'top'),
        color: this.options.defaultCellCheckedBorderColor,
        style: BorderBroad.MEDIUM
      },
      bottom: {
        coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'bottom'),
        color: this.options.defaultCellCheckedBorderColor,
        style: BorderBroad.MEDIUM
      },
      left: {
        coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'left'),
        color: this.options.defaultCellCheckedBorderColor,
        style: BorderBroad.MEDIUM
      },
      right: {
        coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'right'),
        color: this.options.defaultCellCheckedBorderColor,
        style: BorderBroad.MEDIUM
      }
    }
    this.sheet.artboard!.strokeBorder(border)

    return this.renderValue()
  }

  render(): Cell {
    utli.assert(this.x !== null, "x has not been initialized and cannot be rendered!")
    utli.assert(this.y !== null, "y has not been initialized and cannot be rendered!")
    utli.assert(this.width !== null, "width has not been initialized and cannot be rendered!")
    utli.assert(this.height !== null, "height has not been initialized and cannot be rendered!")

    const box: Box = {
      x: this.x!, y: this.y!,
      width: this.width!, height: this.height!,
      backColor: this.cellData.style?.background?.color || this.options.defaultCellBackColor
    }
    this.sheet.artboard!.strokeBox(box)
    if (utli.isDefined(this.cellData.style?.border)) {
      const border: Border = {}
      const borderStyle = this.cellData.style?.border!
      if (borderStyle.top)
        border.top = {
          coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'top'),
          color: borderStyle.top.color,
          style: borderStyle.top.style
        }
      if (borderStyle.bottom)
        border.bottom = {
          coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'bottom'),
          color: borderStyle.bottom.color,
          style: borderStyle.bottom.style
        }
      if (borderStyle.left)
        border.left = {
          coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'left'),
          color: borderStyle.left.color,
          style: borderStyle.left.style
        }
      if (borderStyle.right)
        border.right = {
          coordinateGroup: toCoordinateGroup(this.x!, this.y!, this.width!, this.height!, 'right'),
          color: borderStyle.right.color,
          style: borderStyle.right.style
        }
      this.sheet.artboard!.strokeBorder(border)
    }

    return this.renderValue()
  }

  renderValue(): Cell {
    if (this.DisplayValue !== '') {
      const size = this.cellData.style?.font?.size || this.options.defaultFontSize
      const text: Text = {
        value: this.DisplayValue,
        font: {
          size: size,
          color: this.cellData.style?.font?.color || this.options.defaultFontColor,
          family: this.cellData.style?.font?.family || this.options.defaultFontFamily
        },
        x: this.x! + 5,
        y: this.y! + this.height! - 5,
        align: this.cellData.style?.font?.align,
        baseline: this.cellData.style?.font?.baseline
      }
      this.sheet.artboard!.text(text)
    }
    return this
  }

  renderGrid(): Cell {
    utli.assert(this.x !== null, "x has not been initialized and cannot be rendered!")
    utli.assert(this.y !== null, "y has not been initialized and cannot be rendered!")
    utli.assert(this.width !== null, "width has not been initialized and cannot be rendered!")
    utli.assert(this.height !== null, "height has not been initialized and cannot be rendered!")

    this.sheet.artboard!.strokeBoxBorder({
      x: this.x!, y: this.y!,
      width: this.width!, height: this.height!,
      border: { color: this.options.defaultGridColor, style: BorderBroad.THIN }
    })
    return this
  }

}