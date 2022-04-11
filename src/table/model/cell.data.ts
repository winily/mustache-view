import { Border } from './border.type'
import { FontStyle } from './text.type'


export type CellStyle = {
  font?: FontStyle,
  background?: { color: string },
  border?: Border
}

enum CellType {
  NUMBER = 0,
  TEXT = 1,
  IMAGE = 2,
  FORMULA = 3
}

type CellData = {
  addr: string,
  value: string,
  formula?: string
  type?: CellType,
  style?: CellStyle,
}

export default CellData