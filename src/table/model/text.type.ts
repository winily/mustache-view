import Coordinate from "./coordinate.type";

export type FontStyle = {
  size: number,
  color?: string,
  family?: string,
  align?: CanvasTextAlign,
  baseline?: CanvasTextBaseline,
}

export type Text = {
  value: string | number,
  font: FontStyle
  align?: CanvasTextAlign,
  baseline?: CanvasTextBaseline,
} & Coordinate