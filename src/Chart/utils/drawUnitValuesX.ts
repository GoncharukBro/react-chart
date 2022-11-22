import convertToPercentCoords from './convertToPercentCoords';
import convertToPixelCoords from './convertToPixelCoords';
import applyTranslate from './applyTranslate';

import type { Options } from '../types';

const formatDate = (timestamp: number) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
  return new Date(timestamp).toLocaleDateString('ru', options);
};

export default function drawUnitValuesX(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  translate: React.MutableRefObject<{ prev: number; next: number }>,
  options: Options
) {
  if (ctx.current === null) return;

  const textPadding = 10;

  ctx.current.beginPath();

  ctx.current.font = 'normal 24px Helvetica,sans-serif';
  ctx.current.fillStyle = '#BBBBBB';

  options.areaUnitValuesX.forEach((item) => {
    if (ctx.current === null) return;

    const percentCoords = convertToPercentCoords({ x: item, y: 0 }, options);
    const pixelCoords = convertToPixelCoords(percentCoords, options);

    const { x } = applyTranslate(translate.current.next, pixelCoords, options);

    const text = options.generalMinX !== undefined ? formatDate(item) : '';

    ctx.current.fillText(text, x - 52, options.canvasHeight - textPadding);
    ctx.current.moveTo(x, options.paddingTop);
  });

  ctx.current.closePath();
}
