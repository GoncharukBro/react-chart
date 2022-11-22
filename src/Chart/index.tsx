import { useEffect, useRef, useMemo, forwardRef } from 'react';

import { ContextProvider } from './context';

import useConnectRef from './hooks/useConnectRef';
import getAreaData from './utils/getAreaData';

import Chart from './Chart';
import Interactive from './Interactive';

import type { Options, Tooltip } from './types';

interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[][];
  padding?: Padding | number;
  scale?: number;
  animation?: number;
  tooltip?: Tooltip;
}

function BaseComponent(
  { data, padding = 0, scale, animation = 1, tooltip = null, ...props }: BaseProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const paddingTop = typeof padding === 'number' ? padding : padding.top;
  const paddingBottom = typeof padding === 'number' ? padding : padding.bottom;
  const paddingLeft = typeof padding === 'number' ? padding : padding.left;
  const paddingRight = typeof padding === 'number' ? padding : padding.right;

  const connectRef = useConnectRef();

  const container = useRef<HTMLDivElement>(null);

  const options = useRef<Options | null>(null);
  const translate = useRef({ prev: 0, next: 0 });

  useEffect(() => {
    let animationID = 0;

    // Вычисляем минимальную и максимальную координату в рамках всего графика
    const { generalMinX, generalMaxX, generalMinY, generalMaxY } = data.reduce(
      (prev, [x, y], index) => ({
        generalMinX: x < prev.generalMinX || index === 0 ? x : prev.generalMinX,
        generalMaxX: x > prev.generalMaxX || index === 0 ? x : prev.generalMaxX,
        generalMinY: y < prev.generalMinY || index === 0 ? y : prev.generalMinY,
        generalMaxY: y > prev.generalMaxY || index === 0 ? y : prev.generalMaxY,
      }),
      { generalMinX: 0, generalMaxX: 0, generalMinY: 0, generalMaxY: 0 }
    );

    const animate = () => {
      if (container.current !== null) {
        const { devicePixelRatio: ratio = 1 } = window;
        const { width, height } = container.current.getBoundingClientRect();

        const canvasWidth = width * ratio;
        const canvasHeight = height * ratio;
        const areaWidth = canvasWidth - paddingLeft - paddingRight;
        const areaHeight = canvasHeight - paddingTop - paddingBottom;
        const generalWidth = typeof scale === 'number' ? scale * data.length - scale : areaWidth;

        const gapX = 200;
        const gapY = 100;

        const { areaData, areaMinY, areaMaxY, areaUnitValuesX } =
          scale !== undefined
            ? getAreaData({
                translate,
                options: {
                  generalData: data,
                  generalWidth,
                  generalMinX,
                  generalMaxX,
                  areaWidth,
                  gapX,
                } as Options,
              })
            : {
                areaData: data,
                areaMinY: generalMinY,
                areaMaxY: generalMaxY,
                areaUnitValuesX: [0],
              };

        options.current = {
          canvasWidth,
          canvasHeight,
          generalWidth,
          generalData: data,
          generalMinX,
          generalMaxX,
          areaWidth,
          areaHeight,
          areaData,
          areaMinY,
          areaMaxY,
          areaUnitValuesX,
          gapX,
          gapY,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          scale,
          animation,
        };
      }

      animationID = requestAnimationFrame(animate);
    };

    animationID = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [animation, data, paddingBottom, paddingLeft, paddingRight, paddingTop, scale]);

  const value = useMemo(() => ({ container, options, translate }), []);

  return (
    <div ref={connectRef(forwardedRef, container)} {...props}>
      <ContextProvider value={value}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Chart style={{ position: 'absolute', display: 'block', zIndex: 0 }} />
          <Interactive
            style={{ position: 'absolute', display: 'block', zIndex: 1 }}
            tooltip={tooltip}
          />
        </div>
      </ContextProvider>
    </div>
  );
}

const Base = forwardRef(BaseComponent);

export default Base;
