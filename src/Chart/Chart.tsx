import { useEffect, useRef } from 'react';

import { useContext } from './context';

import use2DContext from './hooks/use2DContext';
import useResize from './hooks/useResize';

import clearCanvas from './utils/clearCanvas';
import clearPadding from './utils/clearPadding';
import clearBorder from './utils/clearBorder';
import drawUnitLinesX from './utils/drawUnitLinesX';
import drawUnitLinesY from './utils/drawUnitLinesY';
import drawUnitValuesX from './utils/drawUnitValuesX';
import drawUnitValuesY from './utils/drawUnitValuesY';
import drawChart from './utils/drawChart';

interface ChartProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

export default function Chart(props: ChartProps) {
  const { container, options, translate } = useContext();

  const cnv = useRef<HTMLCanvasElement>(null);
  const ctx = use2DContext(cnv);

  useResize(container, cnv);

  useEffect(() => {
    let animationID = 0;

    const animate = () => {
      if (ctx.current !== null && options.current !== null) {
        clearCanvas(ctx, options.current);
        drawUnitLinesX(ctx, translate, options.current);
        drawUnitLinesY(ctx, options.current);
        drawChart(ctx, translate, options.current);
        clearPadding(ctx, options.current);
        drawUnitValuesX(ctx, translate, options.current);
        // clearBorder(ctx, options.current);
        drawUnitValuesY(ctx, options.current);
      }

      animationID = requestAnimationFrame(animate);
    };

    animationID = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [ctx, options, translate]);

  return <canvas ref={cnv} {...props} />;
}
