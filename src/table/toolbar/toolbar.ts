import { ToolbarOptions, initAction } from "./components"
import VirtualElement from "../../lib/virtualElement"
import EventBus from "../../lib/eventBus"
import Cell from "../cell"
import Options from "../options"
import ToolAction from "./components/toolAction"

export default class Toolbar extends VirtualElement<'div'> {
  private readonly actions: Array<ToolAction> = []
  public cell: Cell | undefined

  constructor(
    private readonly eventBus: EventBus,
    private readonly options: Options,
  ) {
    super('div', 'mustache-toolbar')

    eventBus.on('click-cell', (addr: string, cell: Cell) => {
      this.cell = cell
    })
    // on('unselect-cell', () => {
    //   console.log('unselect-cell')
    //   this.cell = undefined
    // })
  }

  mount(action: ToolAction): Toolbar {
    this.child(action)
    action.mounted(this)
    this.actions.push(action)
    return this
  }

  mountList(actions?: ToolbarOptions): Toolbar {
    const tools = initAction(actions, this.options)
    tools.forEach(item => this.mount(item))
    return this
  }
}