import type { Options } from '../types';

export default function clearBorder(
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  { canvasWidth, canvasHeight, paddingTop, paddingBottom, paddingLeft, paddingRight }: Options
) {
  if (ctx.current === null) return;

  ctx.current.clearRect(0, 0, paddingLeft, paddingTop);
  ctx.current.clearRect(canvasWidth - paddingRight, 0, paddingRight, paddingTop);
  ctx.current.clearRect(
    canvasWidth - paddingRight,
    canvasHeight - paddingBottom,
    paddingRight,
    paddingBottom
  );
  ctx.current.clearRect(0, canvasHeight - paddingBottom, paddingLeft, paddingBottom);
}
