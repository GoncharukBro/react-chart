import { Options } from '../types';

/**
 * Вычисляет положение координаты в процентах относительно данных координат
 * @returns
 */
export default function convertToPercentCoords(
  { x, y }: { x: number; y: number },
  { generalMinX, generalMaxX, areaMinY, areaMaxY }: Options
) {
  return {
    x: ((x - generalMinX) / (generalMaxX - generalMinX)) * 100,
    y: ((areaMaxY - areaMinY - (y - areaMinY)) / (areaMaxY - areaMinY)) * 100,
  };
}
