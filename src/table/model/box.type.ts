import { BorderSideStyle } from "./border.type";
import Coordinate from "./coordinate.type";

export type Box = {
  width: number,
  height: number
  backColor?: string
  border?: BorderSideStyle,
} & Coordinate