import { useEffect, useRef } from 'react';

import { useContext } from './context';

import use2DContext from './hooks/use2DContext';
import useResize from './hooks/useResize';

import clearCanvas from './utils/clearCanvas';
import drawCursor from './utils/drawCursor';

import Tooltip from './Tooltip';

import type { Tooltip as TooltipType } from './types';

interface InteractiveProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  tooltip: TooltipType;
}

export default function Interactive({ tooltip, ...props }: InteractiveProps) {
  const { container, options, translate } = useContext();

  const cnv = useRef<HTMLCanvasElement>(null);
  const ctx = use2DContext(cnv);

  const activeCoord = useRef({
    item: null as number[] | null,
    prev: { x: -1, y: -1 },
    next: { x: -1, y: -1 },
    transition: 0,
  });

  const interactive = useRef({
    active: false,
    enable: false,
    show: false,
    touch: false,
    touchStart: 0,
    clientX: 0,
    clientY: 0,
  });

  useResize(container, cnv);

  useEffect(() => {
    let animationID = 0;

    const animate = () => {
      if (ctx.current !== null && options.current !== null) {
        clearCanvas(ctx, options.current);
        drawCursor(true, true, ctx, translate, activeCoord, interactive, options.current);
      }

      animationID = requestAnimationFrame(animate);
    };

    animationID = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationID);
    };
  }, [ctx, options, translate]);

  type EventType = React.MouseEvent<HTMLCanvasElement, MouseEvent> &
    React.TouchEvent<HTMLCanvasElement>;

  const getEventClient = (event: EventType) => {
    const currentEvent = event.touches?.[0] ?? event;

    return { x: currentEvent.clientX, y: currentEvent.clientY };
  };

  const setInteractiveClient = (x: number, y: number) => {
    if (cnv.current === null || options.current === null) return;

    const { devicePixelRatio: ratio = 1 } = window;
    const { top, left, width, height } = cnv.current.getBoundingClientRect();

    const isPaddingTop = y - top < options.current.paddingTop / ratio;
    const isPaddingBottom = y - top >= height - options.current.paddingBottom / ratio;
    const isPaddingLeft = x - left < options.current.paddingLeft / ratio;
    const isPaddingRight = x - left >= width - options.current.paddingRight / ratio;

    interactive.current.enable =
      !isPaddingTop && !isPaddingBottom && !isPaddingLeft && !isPaddingRight;
    interactive.current.clientX = (x - left) * ratio;
    interactive.current.clientY = (y - top) * ratio;
  };

  const handleTouchStart = (event: EventType) => {
    if (!interactive.current.active) return;

    const { devicePixelRatio: ratio = 1 } = window;
    const { x } = getEventClient(event);

    interactive.current.touch = true;
    interactive.current.touchStart = x * ratio;
  };

  const handleTouchEnd = () => {
    if (!interactive.current.active) return;

    translate.current.prev = translate.current.next;
    interactive.current.touch = false;
  };

  const handleStart = (event: EventType) => {
    const { x, y } = getEventClient(event);

    setInteractiveClient(x, y);

    interactive.current.active = true;
    interactive.current.show = interactive.current.enable;

    if (event.type === 'touchstart') {
      handleTouchStart(event);
    }
  };

  const handleMove = (event: EventType) => {
    if (options.current === null || !interactive.current.active) return;

    const { devicePixelRatio: ratio = 1 } = window;
    const { x, y } = getEventClient(event);

    setInteractiveClient(x, y);

    if (
      options.current.scale !== undefined &&
      interactive.current.touch &&
      interactive.current.enable
    ) {
      interactive.current.show = false;
      translate.current.next =
        translate.current.prev + (x * ratio - interactive.current.touchStart);
    } else {
      interactive.current.show = interactive.current.enable;
    }
  };

  const handleEnd = (event: EventType) => {
    if (event.type === 'touchend') {
      handleTouchEnd();
    }
    activeCoord.current = {
      item: null,
      prev: { x: -1, y: -1 },
      next: { x: -1, y: -1 },
      transition: 0,
    };
    interactive.current = {
      active: false,
      enable: false,
      show: false,
      touch: false,
      touchStart: 0,
      clientX: 0,
      clientY: 0,
    };
  };

  return (
    <>
      <canvas
        ref={cnv}
        // Touch events
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        // Mouse events
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseEnter={handleStart}
        onMouseMove={handleMove}
        onMouseLeave={handleEnd}
        {...props}
      />

      <Tooltip
        cnv={cnv}
        options={options}
        activeCoord={activeCoord}
        interactive={interactive}
        tooltip={tooltip}
      />
    </>
  );
}
