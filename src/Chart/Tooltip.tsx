import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import type { Tooltip as TooltipType, Options } from './types';

interface TooltipProps {
  cnv: React.RefObject<HTMLCanvasElement>;
  options: React.MutableRefObject<Options | null>;
  activeCoord: React.MutableRefObject<{
    item: number[] | null;
    prev: { x: number; y: number };
    next: { x: number; y: number };
    transition: number;
  }>;
  interactive: React.MutableRefObject<{
    active: boolean;
    enable: boolean;
    show: boolean;
    touch: boolean;
    touchStart: number;
    clientX: number;
    clientY: number;
  }>;
  tooltip: TooltipType;
}

export default function Tooltip({ cnv, options, activeCoord, interactive, tooltip }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<number[] | null>(null);

  useEffect(() => {
    let animationID = 0;

    const animate = () => {
      if (tooltipRef.current !== null) {
        if (cnv.current !== null && options.current !== null && interactive.current.show) {
          if (
            activeCoord.current.prev.x !== activeCoord.current.next.x ||
            activeCoord.current.prev.y !== activeCoord.current.next.y
          ) {
            const { devicePixelRatio: ratio = 1 } = window;
            const { top, left } = cnv.current.getBoundingClientRect();

            const x = activeCoord.current.next.x / ratio + (left + window.pageXOffset);
            const y = activeCoord.current.next.y / ratio + (top + window.pageYOffset);

            tooltipRef.current.style.top = `${y}px`;
            tooltipRef.current.style.left = `${x}px`;

            tooltipRef.current.style.display = 'block';
            tooltipRef.current.style.visibility = 'visible';

            setState(activeCoord.current.item);
          }
        } else {
          tooltipRef.current.style.display = 'none';
          tooltipRef.current.style.visibility = 'hidden';
        }
      }

      animationID = requestAnimationFrame(animate);
    };

    animationID = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [cnv, options, activeCoord, interactive]);

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        transition: 'all',
        transitionDuration: '150ms',
        zIndex: 1,
      }}
    >
      {state && (typeof tooltip === 'function' ? tooltip(state) : tooltip)}
    </div>,
    document.body
  );
}
