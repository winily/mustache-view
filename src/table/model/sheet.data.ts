import CellData from './cell.data'

export type Meta = { hide?: Boolean }

export type ColMeta = { width: number, height?: number, x?: number, y?: number } & Meta
export type RowMeta = { width?: number, height: number, x?: number, y?: number } & Meta

export type ColMetas = { [key: number]: ColMeta }
export type RowMetas = { [key: number]: RowMeta }

export type SheetData = {
  name: string,
  cells: { [key: string]: CellData },
  rowMetas: RowMetas & { count: number },
  colMetas: ColMetas & { count: number },
  hide?: Boolean
}

export default SheetData
