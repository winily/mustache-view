import Options from "../../options";
import Dropdown, { DropdownItemValue } from "./dropdown";

export default class FontSize extends Dropdown {
  constructor(options: Options) {
    super(
      options,
      [
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
        { label: '11', value: 11 },
        { label: '12', value: 12 },
        { label: '14', value: 14 },
        { label: '15', value: 15 },
        { label: '16', value: 16 },
        { label: '18', value: 18 },
        { label: '22', value: 22 },
        { label: '24', value: 24 },
        { label: '26', value: 26 },
        { label: '36', value: 36 },
        { label: '42', value: 42 },
      ],
      'mustache-font-size',
      'mustache-font-size-action'
    )
  }

  click(): (value: DropdownItemValue) => void {
    return (value) => {
      this.text = value.label
      console.log(value)
      console.log(this.toolbar, this.toolbar?.cell)
      this.toolbar!.cell!.setSize(value.value)
    }
  }
}







