import { useEffect, useRef } from 'react';

export default function use2DContext(cnv: React.RefObject<HTMLCanvasElement>) {
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (cnv.current !== null) {
      ctx.current = cnv.current.getContext('2d');
    }
  }, [cnv]);

  return ctx;
}
