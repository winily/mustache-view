import VirtualElement from "../../../lib/virtualElement";

export default class Icon extends VirtualElement<'i'> {
  constructor(icon: string, size: number = 10) {
    super('i', `mustache-icon fa ${icon}`)
    this.style.fontSize = `${size}px`
  }
}