import { Options } from '../types';

/**
 * Смещает координаты для положения в конце холста
 * @param param0
 * @param param1
 * @returns
 */
export default function applyTranslate(
  translate: number,
  { x, y }: { x: number; y: number },
  { generalWidth, areaWidth }: Options
) {
  return {
    x: x - (generalWidth > areaWidth ? generalWidth - areaWidth : 0) + translate,
    y,
  };
}
