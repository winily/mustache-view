import utlis, { npx, thinLineWidth, npxLine } from '../lib/util'
import { Border, BorderBroad, BorderSide } from './model/border.type'
import { Box } from './model/box.type'
import Coordinate from './model/coordinate.type'
import { Text } from './model/text.type'
import Logger from '../lib/logger'
import { emit } from '../lib/eventBus'
import VirtualElement from '../lib/virtualElement'

export default class Artboard extends VirtualElement<'canvas'> {
  private readonly context: CanvasRenderingContext2D
  private readonly logger: Logger

  constructor(
    public clientWidth: number,
    public clientHeight: number
  ) {
    super('canvas', 'mustache-artboard')
    this.logger = new Logger()
    this.clientWidth = clientWidth
    this.clientHeight = clientHeight
    this.el.width = npx(clientWidth)
    this.el.height = npx(clientHeight)
    this.el.style.width = `${clientWidth}px`
    this.el.style.height = `${clientHeight}px`
    this.context = this.el.getContext('2d')!
  }

  resize(clientWidth: number, clientHeight: number): Artboard {
    this.el.width = npx(clientWidth);
    this.el.height = npx(clientHeight);
    this.el.style.width = `${clientWidth}px`;
    this.el.style.height = `${clientHeight}px`;
    this.clientWidth = clientWidth
    this.clientHeight = clientHeight
    emit('artboard-resize', clientWidth, clientHeight)
    this.logger.log("Artboard window resize!", clientWidth, clientHeight)
    return this
  }

  clear(x?: number, y?: number, width?: number, height?: number): Artboard {
    x = x || 0
    y = y || 0
    width = width || this.el.width
    height = height || this.el.height
    this.context.clearRect(npx(x), npx(y), npx(width), npx(height));
    return this;
  }

  save(): Artboard {
    this.context.save();
    this.context.beginPath();
    return this;
  }

  restore(): Artboard {
    this.context.restore();
    return this;
  }

  translate(x: number, y: number): Artboard {
    this.context.translate(npx(x), npx(y));
    return this;
  }


  clearRect(x: number, y: number, width: number, height: number): Artboard {
    this.context.clearRect(x, y, width, height);
    return this;
  }

  fillRect(x: number, y: number, width: number, height: number): Artboard {
    this.context.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
    return this;
  }

  fillText(text: string, x: number, y: number): Artboard {
    this.context.fillText(text, npx(x), npx(y));
    return this;
  }


  border({ style = BorderBroad.MEDIUM, color = "#ebebed" }: BorderSide): Artboard {
    const { context } = this;
    context.lineWidth = thinLineWidth();
    context.strokeStyle = color;
    if (style === BorderBroad.MEDIUM) {
      context.lineWidth = npx(2) - 0.5;
      context.setLineDash([]);
    } else if (style === BorderBroad.THICK) {
      context.lineWidth = npx(3);
      context.setLineDash([]);
    } else if (style === BorderBroad.DASHED) {
      context.setLineDash([npx(3), npx(2)]);
    } else if (style === BorderBroad.DOTTED) {
      context.setLineDash([npx(1), npx(1)]);
    } else if (style === BorderBroad.THIN) {
      context.setLineDash([npx(2), 0]);
    }
    return this;
  }

  line(coordinateGroup: Array<Coordinate>): Artboard {
    const { context } = this;
    if (coordinateGroup.length > 1) {
      context.beginPath();
      const { x, y } = coordinateGroup[0];
      context.moveTo(npxLine(x), npxLine(y));
      for (let i = 1; i < coordinateGroup.length; i++) {
        const coordinate = coordinateGroup[i];
        context.lineTo(npxLine(coordinate.x), npxLine(coordinate.y));
      }
      context.stroke();
    }
    return this;
  }

  strokeBorder(border: Border): Artboard {
    const { context } = this;
    context.save();
    const { top, right, bottom, left } = border;
    if (top) {
      this.border(top);
      this.line(top.coordinateGroup);
    }
    if (right) {
      this.border(right);
      this.line(right.coordinateGroup);
    }
    if (bottom) {
      this.border(bottom);
      this.line(bottom.coordinateGroup);
    }
    if (left) {
      this.border(left);
      this.line(left.coordinateGroup);
    }
    context.restore();
    return this
  }

  strokeBoxBorder(box: Box): Artboard {
    utlis.assert(utlis.isDefined(box.border), "The border of the box must exist during strokeBoxBorder!")
    const border: Border = {
      top: {
        style: box.border?.style,
        color: box.border?.color,
        coordinateGroup: [{ x: box.x, y: box.y }, { x: box.x + box.width, y: box.y }]
      },
      bottom: {
        style: box.border?.style,
        color: box.border?.color,
        coordinateGroup: [{ x: box.x, y: box.y + box.height }, { x: box.x + box.width, y: box.y + box.height }]
      },
      left: {
        style: box.border?.style,
        color: box.border?.color,
        coordinateGroup: [{ x: box.x, y: box.y }, { x: box.x, y: box.y + box.height }]
      },
      right: {
        style: box.border?.style,
        color: box.border?.color,
        coordinateGroup: [{ x: box.x + box.width, y: box.y }, { x: box.x + box.width, y: box.y + box.height }]
      }
    }
    this.strokeBorder(border)
    return this
  }

  strokeBox(box: Box): Artboard {
    this.context.fillStyle = box.backColor || "#fff"
    this.context.fillRect(npx(box.x), npx(box.y), npx(box.width), npx(box.height))
    if (utlis.isDefined(box.border)) {
      const border: Border = {
        top: {
          style: box.border?.style,
          color: box.border?.color,
          coordinateGroup: [{ x: box.x, y: box.y }, { x: box.x + box.width, y: box.y }]
        },
        bottom: {
          style: box.border?.style,
          color: box.border?.color,
          coordinateGroup: [{ x: box.x, y: box.y + box.height }, { x: box.x + box.width, y: box.y + box.height }]
        },
        left: {
          style: box.border?.style,
          color: box.border?.color,
          coordinateGroup: [{ x: box.x, y: box.y }, { x: box.x, y: box.y + box.height }]
        },
        right: {
          style: box.border?.style,
          color: box.border?.color,
          coordinateGroup: [{ x: box.x + box.width, y: box.y }, { x: box.x + box.width, y: box.y + box.height }]
        }
      }
      this.strokeBorder(border)
    }
    return this
  }


  text(text: Text): Artboard {
    this.context.textAlign = text.align || 'left'
    this.context.textBaseline = text.baseline || 'alphabetic'
    this.context.fillStyle = text.font.color || "#1f1f1f"
    this.context.font = `${npx(text.font.size)}px ${text.font.family || "serif"}`
    this.context.fillText(text.value.toString(), npx(text.x), npx(text.y), this.context.measureText(text.value.toString()).width)
    return this
  }
}