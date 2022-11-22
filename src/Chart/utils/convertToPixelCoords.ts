import { Options } from '../types';

/**
 * Конвертирует положение координаты в пиксели относительно общей ширины для рисования
 * @returns
 */
export default function convertToPixelCoords(
  { x, y }: { x: number; y: number },
  { generalWidth, areaHeight, paddingTop, paddingLeft }: Options
) {
  return {
    x: Math.floor((x * generalWidth) / 100 + paddingLeft),
    y: Math.floor((y * areaHeight) / 100 + paddingTop),
  };
}
