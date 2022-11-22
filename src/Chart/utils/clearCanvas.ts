import type { Options } from '../types';

export default function clearCanvas(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  { canvasWidth, canvasHeight }: Options
) {
  if (ctx.current === null) return;

  ctx.current.clearRect(0, 0, canvasWidth, canvasHeight);
}
