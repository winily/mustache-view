import VirtualElement from '../lib/virtualElement'
import Cell from './cell'
import Options from './options'

export default class Input extends VirtualElement<'textarea'> {
  private static readonly input: Input = new Input()

  private cell: Cell | undefined

  constructor() {
    super('textarea', 'mustache-input')
    this.on('change', (e: Event) => {
      this.input(this.inputValue)
    })
    this.on('blur', (e: Event) => {
      this.closeInput()
    })

  }

  input(value: string) {
    this.cell?.updateValue(value)
  }

  closeInput(): Input {
    this.cell = undefined
    this.display(true)
    return this
  }

  openInput(cell: Cell, options: Options): Input {
    this.inputValue = cell.Value
    this.el.style.width = `${cell.Width}px`
    this.el.style.height = `${cell.Height}px`
    this.el.style.left = `${cell.X + options.scrollbarVerticalWidth + 0.5}px`
    this.el.style.top = `${cell.Y + options.scrollbarHorizontalHeight + 0.5}px`
    this.cell = cell
    this.display(false).focus()
    return this
  }

  static getInstance(): Input {
    return this.input
  }
}

export const input = Input.getInstance()