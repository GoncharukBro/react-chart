import type { Options } from '../types';

export default function drawUnitLinesY(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  { canvasWidth, areaHeight, gapY, paddingTop, paddingLeft, paddingRight }: Options
) {
  if (ctx.current === null) return;
  // Вычисляем количество линий единиц измерения на графике
  const count = Math.floor(areaHeight / gapY);

  ctx.current.beginPath();

  ctx.current.lineWidth = 1;
  ctx.current.strokeStyle = '#BBBBBB';

  for (let i = 0; i <= count; i++) {
    const y = Math.floor((areaHeight / count) * i + paddingTop);

    ctx.current.moveTo(paddingLeft, y);
    ctx.current.lineTo(canvasWidth - paddingRight, y);
  }

  ctx.current.stroke();
  ctx.current.closePath();
}
