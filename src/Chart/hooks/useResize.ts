/* eslint-disable no-param-reassign */
import { useEffect } from 'react';

export default function useResize(
  container: React.RefObject<HTMLDivElement>,
  cnv: React.RefObject<HTMLCanvasElement>
) {
  useEffect(() => {
    const currentContainer = container.current ?? document.body;

    const setSize = () => {
      if (cnv.current !== null) {
        const { devicePixelRatio: ratio = 1 } = window;
        const { width, height } = currentContainer.getBoundingClientRect();

        cnv.current.width = width * ratio;
        cnv.current.height = height * ratio;
        cnv.current.style.width = `${width}px`;
        cnv.current.style.height = `${height}px`;
      }
    };

    setSize();

    const resizeObserver = new ResizeObserver(() => {
      setSize();
    });

    resizeObserver.observe(currentContainer);

    return () => {
      resizeObserver.unobserve(currentContainer);
    };
  }, [container, cnv]);
}
