import Artboard from './artboard';
import SheetData, { ColMeta, ColMetas, RowMeta, RowMetas } from './model/sheet.data';
import { BorderBroad } from './model/border.type'
import { stringAt } from '../lib/util';
import Options from './options';

export enum Direction { HORIZONTAL, VERTICAL }

export default class Scrollbar {

  public horizontalMeta: ColMetas = {}
  public verticalMeta: RowMetas = {}

  // public horizontalBoundary: Array<{ col: ColMeta, x: number }> = []
  // public verticalBoundary: Array<{ row: RowMeta, y: number }> = []

  constructor(
    private readonly artboard: Artboard,
    private readonly sheet: SheetData,
    private readonly options: Options
  ) {
  }


  // 横方向
  renderHorizontal(colMetas: ColMetas): Scrollbar {
    this.horizontalMeta = {}
    const { scrollbarHorizontalHeight } = this.options
    let x = 0;
    const y = -(scrollbarHorizontalHeight)
    Object.keys(colMetas).forEach((key) => {
      const item = colMetas[Number(key)]
      item.height = scrollbarHorizontalHeight
      item.x = x
      item.y = y
      this.horizontalMeta[Number(key)] = item
      this.renderItem(x, y, item.width, scrollbarHorizontalHeight, stringAt(Number(key)))
      x += item.width
    })
    return this
  }

  // 纵方向
  renderVertical(rowMetas: RowMetas): Scrollbar {
    this.verticalMeta = {}
    const { scrollbarVerticalWidth } = this.options
    const x = -(scrollbarVerticalWidth);
    let y = 0
    Object.keys(rowMetas).forEach((key) => {
      const item = rowMetas[Number(key)]
      item.width = scrollbarVerticalWidth
      item.x = x
      item.y = y
      this.verticalMeta[Number(key)] = item
      this.renderItem(x, y, scrollbarVerticalWidth, item.height, Number(key) + 1)
      y += item.height
    })
    return this
  }

  renderZeroPoint(): Scrollbar {
    const {
      scrollbarHorizontalHeight,
      scrollbarVerticalWidth,
      scrollbarBackColor,
      defaultGridColor
    } = this.options
    this.artboard.strokeBox({
      x: -(scrollbarVerticalWidth),
      y: -(scrollbarHorizontalHeight),
      width: scrollbarVerticalWidth,
      height: scrollbarHorizontalHeight,
      border: { color: defaultGridColor, style: BorderBroad.THIN },
      backColor: scrollbarBackColor
    })
    return this
  }

  renderItem(x: number, y: number, width: number, height: number, text: string | number): Scrollbar {
    const {
      scrollbarFontSize, scrollbarBackColor,
      defaultGridColor, defaultFontColor, defaultFontFamily
    } = this.options
    this.artboard.strokeBox({
      x, y,
      width,
      height,
      border: { color: defaultGridColor, style: BorderBroad.THIN },
      backColor: scrollbarBackColor
    })
    this.artboard.text({
      value: text,
      x: x + width / 2, y: y + height / 2,
      font: { size: scrollbarFontSize, color: defaultFontColor, family: defaultFontFamily },
      align: 'center',
      baseline: 'middle'
    })
    return this
  }



  /**
   * TODO 改造需求，至，传入某一 行列区域，条件渲染，不再所有全部渲染
   * @param translateX 
   * @param translateY 
   */

  render(translateX: number, translateY: number) {
    const x = Math.abs(translateX)
    const y = Math.abs(translateY)
    const {
      defaultCellHeight, defaultCellWidth,
      scrollbarHorizontalHeight, scrollbarVerticalWidth,
      scrollbarFontSize, scrollbarBackColor,
      defaultGridColor, defaultFontColor
    } = this.options
    let rowY = scrollbarHorizontalHeight
    for (let rowIndex = 0; rowIndex < this.sheet.rowMetas.count; rowIndex++) {
      const rowItem = this.sheet.rowMetas[rowIndex];
      let height = rowItem?.height || defaultCellHeight
      this.artboard.strokeBox({
        x, y: rowY,
        width: scrollbarVerticalWidth,
        height: height,
        border: { color: defaultGridColor, style: BorderBroad.THIN },
        backColor: scrollbarBackColor
      })
      this.artboard.text({
        value: rowIndex + 1,
        x: x + scrollbarVerticalWidth / 2, y: rowY + height / 2,
        font: { size: scrollbarFontSize },
        align: 'center',
        baseline: 'middle'
      })
      rowY += height
    }

    let colX = scrollbarVerticalWidth

    for (let colIndex = 0; colIndex < this.sheet.colMetas.count; colIndex++) {
      const colItem = this.sheet.colMetas[colIndex];
      let width = colItem?.width || defaultCellWidth
      this.artboard.strokeBox({
        x: colX, y,
        width: width,
        height: 25,
        border: { color: defaultGridColor, style: BorderBroad.THIN },
        backColor: scrollbarBackColor
      })
      this.artboard.text({
        value: stringAt(colIndex),
        x: colX + width / 2,
        y: y + scrollbarHorizontalHeight / 2,
        font: { size: scrollbarFontSize },
        align: 'center',
        baseline: 'middle'
      })
      colX += width
    }

    this.artboard.strokeBox({
      x, y,
      width: scrollbarVerticalWidth,
      height: scrollbarHorizontalHeight,
      border: { color: defaultGridColor, style: BorderBroad.THIN },
      backColor: scrollbarBackColor
    })
  }
}