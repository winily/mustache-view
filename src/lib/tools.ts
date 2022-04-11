import utli from './util'
import SheetData from '../table/model/sheet.data'
import lodash from 'lodash'

export const calcSheetSize = (sheet: SheetData): { width: number, height: number } => {
  const rowKeys = Object.keys(sheet.rowsMate).filter(key => /^\d$/.test(key))
  let height = rowKeys
    .map((key) => sheet.rowsMate[Number(key)].height)
    .filter(height => lodash.isNumber(height))
    .reduce((sum, height) => sum += height, 0);
  height += rowKeys.length < sheet.rowsMate.count ? (sheet.rowsMate.count - rowKeys.length) * 50 : 0

  const colKeys = Object.keys(sheet.colsMate).filter(key => /^\d$/.test(key))
  let width = colKeys
    .map((key) => sheet.colsMate[Number(key)].width)
    .filter(width => lodash.isNumber(width))
    .reduce((sum, width) => sum += width, 0);
  width += colKeys.length < sheet.colsMate.count ? (sheet.colsMate.count - colKeys.length) * 100 : 0



  return { width: utli.npx(width), height: utli.npx(height), }
}