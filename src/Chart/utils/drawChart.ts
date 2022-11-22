import convertToPercentCoords from './convertToPercentCoords';
import convertToPixelCoords from './convertToPixelCoords';
import applyTranslate from './applyTranslate';

import type { Options } from '../types';

export default function drawChart(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  translate: React.MutableRefObject<{ prev: number; next: number }>,
  options: Options
) {
  if (ctx.current === null) return;

  ctx.current.beginPath();

  ctx.current.lineWidth = 4;
  ctx.current.lineJoin = 'round';
  ctx.current.strokeStyle = '#000000';

  options.areaData.forEach((item, index) => {
    if (ctx.current === null) return;

    const percentCoords = convertToPercentCoords({ x: item[0], y: item[1] }, options);
    const pixelCoords = convertToPixelCoords(percentCoords, options);

    const { x, y } = applyTranslate(translate.current.next, pixelCoords, options);

    if (index === 0) {
      ctx.current.moveTo(x, y);
    } else {
      ctx.current.lineTo(x, y);
    }
  });

  ctx.current.stroke();
  ctx.current.closePath();
}
