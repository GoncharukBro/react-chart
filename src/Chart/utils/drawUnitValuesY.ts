import type { Options } from '../types';

export default function drawUnitValuesY(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  { areaHeight, areaMinY, areaMaxY, gapY, paddingTop, paddingLeft }: Options
) {
  if (ctx.current === null) return;
  // Вычисляем количество линий единиц измерения на графике
  const count = Math.floor(areaHeight / gapY);

  const step = (areaMaxY - areaMinY) / count;
  const textPadding = 10;

  ctx.current.beginPath();

  ctx.current.font = 'normal 24px Helvetica,sans-serif';
  ctx.current.fillStyle = '#BBBBBB';

  for (let i = 0; i <= count; i++) {
    const y = Math.floor((areaHeight / count) * i + paddingTop);
    const text =
      areaMinY !== undefined
        ? (areaMinY + areaMaxY - (areaMinY + step * i)).toFixed(2).toString()
        : '';

    ctx.current.fillText(text, textPadding, y + 8);
    ctx.current.moveTo(paddingLeft, y);
  }

  ctx.current.closePath();
}
