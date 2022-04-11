import '../lib/jquery-3.6.0.min.js'
import '../lib/bootstrap/js/bootstrap.bundle.min.js'

import lodash from 'lodash'
import utli from '../lib/util'
import TableData from './model/table.data'
import Options, { OptionsType } from './options'

import "./css/index.less"
import Sheet from './sheet'
import Toolbar from './toolbar/toolbar'
import VirtualElement from '../lib/virtualElement'
import { ToolbarOptions } from './toolbar/components'

export default class Table extends VirtualElement<'div'> {
  private readonly options: Options
  private readonly toolbar: Toolbar

  private tableData: TableData | null = null
  private sheets: Array<Sheet> = []

  constructor(
    el: string,
    options?: OptionsType,
    toolbarOptions?: ToolbarOptions
  ) {
    const div = document.querySelector<HTMLDivElement>(el)
    utli.assert(!(lodash.isNull(el) || lodash.isUndefined(el)), "The passed in 'el dom' does not exist")
    super(div!, "mustache-table")
    this.options = new Options(options)
    this.toolbar = new Toolbar(this.options)
    this.child(this.toolbar)
    this.toolbar.mountList(toolbarOptions)

    window.getData = () => {
      return this.tableData
    }
  }

  load(table: TableData): Table {
    utli.assert(utli.isDefined(table), "table must exist!")
    utli.assert(utli.isDefined(table.sheets) && table.sheets.length > 0, " table.sheets must exist!")
    this.tableData = table
    this.sheets.push(new Sheet(this.tableData.sheets[0], this.options))
    this.children(...this.sheets)
    this.sheets[0].render()
    return this
  }

}