import { defaultsDeep } from 'lodash'

export type OptionsType = {
  showGrid?: boolean,
  defaultGridColor?: string

  cellMinWidth?: number,
  cellMinHeight?: number,

  defaultCellWidth?: number,
  defaultCellHeight?: number,
  defaultCellBackColor?: string
  defaultCellCheckedBackColor?: string
  defaultCellCheckedBorderColor?: string

  defaultFontSize?: number,
  defaultFontColor?: string,
  defaultFontFamily?: string,

  scrollbarHorizontalHeight?: number,
  scrollbarVerticalWidth?: number,
  scrollbarFontSize?: number,
  scrollbarBackColor?: string
}

export default class Options {
  constructor(options?: OptionsType) {
    options = defaultsDeep(options || {}, defaultOptions)
    this.showGrid = options!.showGrid!
    this.defaultGridColor = options!.defaultGridColor!

    this.cellMinWidth = options!.cellMinWidth!
    this.cellMinHeight = options!.cellMinHeight!

    this.defaultCellWidth = options!.defaultCellWidth!
    this.defaultCellHeight = options!.defaultCellHeight!
    this.defaultCellBackColor = options!.defaultCellBackColor!
    this.defaultCellCheckedBackColor = options!.defaultCellCheckedBackColor!
    this.defaultCellCheckedBorderColor = options!.defaultCellCheckedBorderColor!

    this.defaultFontSize = options!.defaultFontSize!
    this.defaultFontColor = options!.defaultFontColor!
    this.defaultFontFamily = options!.defaultFontFamily!

    this.scrollbarHorizontalHeight = options!.scrollbarHorizontalHeight!
    this.scrollbarVerticalWidth = options!.scrollbarVerticalWidth!
    this.scrollbarFontSize = options!.scrollbarFontSize!
    this.scrollbarBackColor = options!.scrollbarBackColor!
  }

  public readonly showGrid: boolean
  public readonly defaultGridColor: string

  public readonly cellMinWidth: number
  public readonly cellMinHeight: number

  public readonly defaultCellWidth: number
  public readonly defaultCellHeight: number
  public readonly defaultCellBackColor: string
  public readonly defaultCellCheckedBackColor: string
  public readonly defaultCellCheckedBorderColor: string

  public readonly defaultFontSize: number
  public readonly defaultFontColor: string
  public readonly defaultFontFamily: string

  public readonly scrollbarHorizontalHeight: number
  public readonly scrollbarVerticalWidth: number
  public readonly scrollbarFontSize: number
  public readonly scrollbarBackColor: string

}



const macaron_primary_color = '#b699dd';
const macaron_secondary_color = '#d3bfe4';

const morandi_primary_color = '#769a80';
const morandi_secondary_color = '#acc9b5';
const morandi_secondary_back_color = '#b9d4c2';


export const defaultOptions: OptionsType = {
  showGrid: true,
  defaultGridColor: morandi_secondary_color,
  // defaultGridColor: '#ebebed',

  cellMinWidth: 20,
  cellMinHeight: 25,

  defaultCellWidth: 100,
  defaultCellHeight: 25,
  defaultCellBackColor: '#FFFFFF',
  defaultCellCheckedBackColor: "#edf3ff",
  defaultCellCheckedBorderColor: "#4b88ff",

  defaultFontSize: 14,
  defaultFontColor: '#1f1f1f',
  defaultFontFamily: 'LarkHackSafariFont,LarkEmojiFont,LarkChineseQuote,-apple-system,BlinkMacSystemFont,Helvetica Neue,Arial,Segoe UI,PingFang SC,Microsoft Yahei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',

  scrollbarHorizontalHeight: 25,
  scrollbarVerticalWidth: 50,
  scrollbarFontSize: 14,
  scrollbarBackColor: morandi_secondary_back_color
  // scrollbarBackColor: '#f4f5f8'
}