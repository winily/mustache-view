import VirtualElement from "../../../lib/virtualElement";
import Options from "../../options";
import ToolAction from "./toolAction";

export default abstract class Dropdown extends ToolAction {
  private readonly button: DropdownButton

  constructor(
    options: Options,
    private readonly list: Array<DropdownItemValue>,
    private readonly id: string,
    className: string = ""
  ) {
    super(options, `${className} dropdown`)
    this.button = new DropdownButton("10", id)
    this.child(this.button)
    this.initList()
  }

  set text(value: string) {
    this.button.text = value
  }

  initList() {
    const menu = new VirtualElement('div', `dropdown-menu mustache-dropdown-menu`)
    menu.attr('aria-labelledby', this.id)
    this.list.forEach(item => {
      menu.child(new DropdownItem(item, this.click()))
    })
    this.child(menu)
  }
  abstract click(): (value: DropdownItemValue) => void
}

export type DropdownItemValue = { label: string, value: number }
export class DropdownItem extends VirtualElement<'button'> {

  get value() {
    return this.itemValye
  }

  constructor(
    private readonly itemValye: DropdownItemValue,
    clickFun: Function = () => { }
  ) {
    super('button', `dropdown-item`)
    this.attr('type', 'button')
    this.innerText = itemValye.label
    this.on('click', () => {
      clickFun(this.value)
    })
  }
}

export class DropdownButton extends VirtualElement<'button'> {
  private readonly textSpan: VirtualElement<'span'>

  constructor(text: string, id: string) {
    super('button', `btn btn-sm dropdown-toggle`)

    this.attr('id', id)
    this.attr('type', 'button')
    this.attr('data-toggle', 'dropdown')
    this.attr('aria-expanded', 'false')

    this.textSpan = new VirtualElement('span')
    this.child(this.textSpan)
    this.text = '10'
  }

  set text(value: string) {
    this.textSpan.innerText = value
  }
}