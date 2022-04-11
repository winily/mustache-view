import Options from "../../options"
import FontSize from "./fontSize"
import ToolAction from "./toolAction"

export * from "./toolAction"

export interface ActionMap {
  'font-size': FontSize
}

export const initAction = (toolbarOptions: ToolbarOptions = [], options: Options): Array<ToolAction> => {
  const actions: Array<ToolAction> = []
  if (toolbarOptions.includes('font-size') || toolbarOptions.length === 0) actions.push(new FontSize(options))
  return actions
}

export type ToolbarOptions = Array<keyof ActionMap | ToolAction>
