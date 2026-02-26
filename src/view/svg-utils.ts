import {Arrows} from "../model/geometry";

const stickerDrawSize = 100;

/*
 * Object Literal Namespace or a Module Object.
 */
export const SvgUtils = {
  createArrowHead,
  drawArrows,
  drawBackgroundRect,
  drawGrid,
  drawResetRotateIcon,
  drawRotateLeftIcon,
  drawRotateRightIcon,
  drawSticker
};

/**
 * Draw static background grid; unresponsive, black, rectangular lines
 * @param svg - SVG to draw in
 * @param width - width of SVG's view box
 * @param height - height of SVG's view box
 * @param offset - distance to top left corner for first vertical and horizontal line
 */
function drawGrid(svg: SVGSVGElement, width: number, height: number, offset = 0) {
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

function drawArrows(svg: SVGSVGElement, arrows: Arrows, stroke: string) {
  arrows.forEach(({start, end}) => {
    svg.createSvg('line', {
      attr: {
        x1: start.x, y1: start.y,
        x2: end.x, y2: end.y,
        'marker-end': `url(#arrowhead${stroke})`,
        stroke // shorthand
      },
      cls: 'rubik-cube-arrow'
    });
  });
}

/**
 * Creates the <defs> and <marker> required for the arrow tips.
 */
function createArrowHead(svg: SVGSVGElement, color: string) {
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
function drawBackgroundRect(svg: SVGSVGElement, fill: string) {
  svg.createSvg('rect', {
    attr: {width: '100%', height: '100%', fill}, // Shorthand property {fill: fill}
    cls: "rubik-cube-pll-rect"
  });
}

/**
 * Draws a single colored "sticker" (rectangle) on the cube.
 */
function drawSticker(svg: SVGSVGElement,
                     x: number,
                     y: number,
                     width: number,
                     height: number,
                     fill: number | string, // Accept either
                     isGrid = false
) {
  svg.createSvg('rect', {
    attr: {x, y, width, height, fill},
    cls: isGrid ? "rubik-cube-pll-line-grid" : "rubik-cube-rect"
  });
}

/**
 * @param {SVGSVGElement} svg - resetRotationSvg
 */
function drawResetRotateIcon(svg: SVGSVGElement) {
  svg.createSvg('circle', {attr: {cx: 12, cy: 12, r:11}});
  svg.createSvg('line', {attr: {x1: 7, y1: 7, x2: 17, y2: 17}});
  svg.createSvg('line', {attr: {x1: 17, y1: 7, x2: 7, y2: 17}});
}

/**
 * Draws the "Rotate Left" icon onto an SVG
 */
function drawRotateLeftIcon(svg: SVGSVGElement) {
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
function drawRotateRightIcon(svg: SVGSVGElement) {
  svg.createSvg('rect', {attr: {x: 2, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
  svg.createSvg('line', {attr: {x1: 6, y1: 2, x2: 6, y2: 14}});
  svg.createSvg('line', {attr: {x1: 10, y1: 2, x2: 10, y2: 14}});
  svg.createSvg('line', {attr: {x1: 2, y1: 6, x2: 14, y2: 6}});
  svg.createSvg('line', {attr: {x1: 2, y1: 10, x2: 14, y2: 10}});
  svg.createSvg('path', {attr: {d: 'M11 22a10 10 0 0 0 10 -10v-2', 'stroke-width': 1.5}});
  svg.createSvg('polyline', {attr: {points: '18,13 21,10 24,13', 'stroke-width': 1.5}});
}
