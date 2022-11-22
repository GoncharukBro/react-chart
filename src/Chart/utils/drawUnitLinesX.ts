import convertToPercentCoords from './convertToPercentCoords';
import convertToPixelCoords from './convertToPixelCoords';
import applyTranslate from './applyTranslate';

import type { Options } from '../types';

export default function drawUnitLinesX(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  translate: React.MutableRefObject<{ prev: number; next: number }>,
  options: Options
) {
  if (ctx.current === null) return;

  ctx.current.beginPath();

  ctx.current.lineWidth = 1;
  ctx.current.strokeStyle = '#BBBBBB';

  options.areaUnitValuesX.forEach((item) => {
    if (ctx.current === null) return;

    const percentCoords = convertToPercentCoords({ x: item, y: 0 }, options);
    const pixelCoords = convertToPixelCoords(percentCoords, options);

    const { x } = applyTranslate(translate.current.next, pixelCoords, options);

    ctx.current.moveTo(x, options.paddingTop);
    ctx.current.lineTo(x, options.canvasHeight - options.paddingBottom);
  });

  ctx.current.stroke();
  ctx.current.closePath();
}
