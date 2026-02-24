import {Arrows} from "../model/geometry";

const stickerDrawSize = 100;

/**
 * Draw static background grid; unresponsive, black, rectangular lines
 * @param svg - SVG to draw in
 * @param width - width of SVG's view box
 * @param height - height of SVG's view box
 * @param offset - distance to top left corner for first vertical and horizontal line
 */
export function drawGrid(svg: SVGSVGElement, width: number, height: number, offset: number = 0) {
  /* Vertical lines */
  for (let x = offset; x < width; x += stickerDrawSize) {
    svg.createSvg('line', {
      attr: {x1: x, x2: x, y1: 0, y2: height},
      cls: 'rubik-cube-pll-line-grid'
    });
  }
  /* Horizontal lines */
  for (let y = offset; y < height; y += stickerDrawSize) {
    svg.createSvg('line', {
      attr: {x1: 0, x2: width, y1: y, y2: y},
      cls: 'rubik-cube-pll-line-grid'
    });
  }
}

export function drawArrows(svg: SVGSVGElement, arrows: Arrows, color: string) {
  for (const arrow of arrows) {
    svg.createSvg('line', {
      attr: {
        x1: arrow.start.x, y1: arrow.start.y,
        x2: arrow.end.x, y2: arrow.end.y,
        'marker-end': `url(#arrowhead${color})`,
        stroke: color
      },
      cls: 'rubik-cube-arrow'
    });
  }
}

/**
 * Creates the <defs> and <marker> required for the arrow tips.
 */
export function createArrowHead(svg: SVGSVGElement, color: string): void {
  const defs = svg.createSvg('defs');
  const marker = defs.createSvg('marker', {
    attr: {
      id: 'arrowhead' + color,
      markerWidth: '10',
      markerHeight: '7',
      refX: '9',
      refY: '3.5',
      orient: 'auto'
    }
  });
  /* Arrow head. Triangle with coordinates 0,0 / 10,3.5 / 0,7 */
  marker.createSvg('polygon', {
    attr: {points: '0,0 10,3.5 0,7', fill: color}
  });
}

/**
 * Draws the background color rectangle for the SVG.
 */
export function drawBackgroundRect(svg: SVGSVGElement, color: string): void {
  svg.createSvg('rect', {
    attr: {width: '100%', height: '100%', fill: color},
    cls: "rubik-cube-pll-rect"
  });
}

/**
 * Draws a single colored "sticker" (rectangle) on the cube.
 */
export function drawSticker(
  svg: SVGSVGElement,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  isGrid: boolean = false
): void {
  svg.createSvg('rect', {
    attr: {
      x: x,
      y: y,
      width: width.toString(),
      height: height.toString(),
      fill: color
    },
    cls: isGrid ? "rubik-cube-pll-line-grid" : "rubik-cube-rect"
  });
}

/**
 * Draws the "Rotate Left" icon onto an SVG
 */
export function drawRotateLeftIcon(svg: SVGSVGElement): void {
  svg.createSvg('rect', {attr: {x: 10, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
  svg.createSvg('line', {attr: {x1: 14, y1: 2, x2: 14, y2: 14}});
  svg.createSvg('line', {attr: {x1: 18, y1: 2, x2: 18, y2: 14}});
  svg.createSvg('line', {attr: {x1: 10, y1: 6, x2: 22, y2: 6}});
  svg.createSvg('line', {attr: {x1: 10, y1: 10, x2: 22, y2: 10}});
  svg.createSvg('path', {attr: {d: 'M13 22a10 10 0 0 1 -10 -10v-2', 'stroke-width': 1.5}});
  svg.createSvg('polyline', {attr: {points: '0,13 3,10 6,13', 'stroke-width': 1.5}});
}

/**
 * Draws the "Rotate Right" icon onto an SVG
 */
export function drawRotateRightIcon(svg: SVGSVGElement): void {
  svg.createSvg('rect', {attr: {x: 2, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
  svg.createSvg('line', {attr: {x1: 6, y1: 2, x2: 6, y2: 14}});
  svg.createSvg('line', {attr: {x1: 10, y1: 2, x2: 10, y2: 14}});
  svg.createSvg('line', {attr: {x1: 2, y1: 6, x2: 14, y2: 6}});
  svg.createSvg('line', {attr: {x1: 2, y1: 10, x2: 14, y2: 10}});
  svg.createSvg('path', {attr: {d: 'M11 22a10 10 0 0 0 10 -10v-2', 'stroke-width': 1.5}});
  svg.createSvg('polyline', {attr: {points: '18,13 21,10 24,13', 'stroke-width': 1.5}});
}
