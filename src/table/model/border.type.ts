import Coordinate from "./coordinate.type"


export enum BorderBroad {
  MEDIUM = 'MEDIUM',// 线
  THICK = 'THICK',  // 粗线
  DASHED = 'DASHED',// 虚线
  DOTTED = 'DOTTED',// 点线
  THIN = 'THIN',// 双划线
}


export type BorderSideStyle = {
  style?: BorderBroad,
  color?: string,
}

export type BorderStyle = {
  top?: BorderSideStyle,
  right?: BorderSideStyle,
  bottom?: BorderSideStyle,
  left?: BorderSideStyle,
}

export type BorderSide = {
  coordinateGroup: Array<Coordinate>
} & BorderSideStyle

export type Border = {
  top?: BorderSide,
  right?: BorderSide,
  bottom?: BorderSide,
  left?: BorderSide,
}

export const toCoordinateGroup = (
  x: number, y: number,
  width: number, height: number,
  position: 'top' | 'right' | 'bottom' | 'left'
): Array<Coordinate> => {
  if (position === 'top') return [{ x, y }, { x: x + width, y }]
  if (position === 'bottom') return [{ x, y: y + height }, { x: x + width, y: y + height }]

  if (position === 'left') return [{ x, y }, { x, y: y + height }]
  return [{ x: x + width, y }, { x: x + width, y: y + height }]
}