import type { Options } from '../types';

export default function clearPadding(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  { canvasWidth, canvasHeight, paddingTop, paddingBottom, paddingLeft, paddingRight }: Options
) {
  if (ctx.current === null) return;

  ctx.current.clearRect(0, 0, canvasWidth, paddingTop);
  ctx.current.clearRect(0, canvasHeight - paddingBottom, canvasWidth, paddingBottom);
  ctx.current.clearRect(0, 0, paddingLeft, canvasHeight);
  ctx.current.clearRect(canvasWidth - paddingRight, 0, paddingRight, canvasHeight);
}
