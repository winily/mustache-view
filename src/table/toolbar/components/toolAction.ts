import VirtualElement from "../../../lib/virtualElement";
import Options from "../../options";
import Toolbar from "../toolbar";

export default class ToolAction extends VirtualElement<'div'> {
  constructor(
    protected readonly options: Options,
    className: string = ""
  ) {
    super('div', `mustache-tool-action ${className}`)
  }

  protected toolbar: Toolbar | undefined

  mounted(toolbar: Toolbar) {
    this.toolbar = toolbar
  }
}