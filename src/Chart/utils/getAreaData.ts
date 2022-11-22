import convertToPercentCoords from './convertToPercentCoords';
import convertToPixelCoords from './convertToPixelCoords';

import { Options } from '../types';

interface GetAreaDataParams {
  translate: React.MutableRefObject<{ prev: number; next: number }>;
  options: Options;
}

export default function getAreaData({ translate, options }: GetAreaDataParams) {
  const { generalWidth, areaWidth } = options;

  const result = {
    areaData: [] as number[][],
    areaMinY: 0,
    areaMaxY: 0,
    areaUnitValuesX: [] as number[],
  };

  // Вычисляем границы области просмотра в процентах
  const leftBorder =
    (((generalWidth > areaWidth ? generalWidth - areaWidth : 0) - translate.current.next) * 100) /
    generalWidth;
  const rightBorder = leftBorder + (areaWidth * 100) / generalWidth;

  const setState = (item: number[]) => {
    result.areaData.push(item);
    result.areaMinY =
      result.areaData.length === 1 || item[1] < result.areaMinY ? item[1] : result.areaMinY;
    result.areaMaxY =
      result.areaData.length === 1 || item[1] > result.areaMaxY ? item[1] : result.areaMaxY;
  };

  let orderNumber = -1;
  let minX = 0;

  options.generalData.forEach((item, index, array) => {
    const percentCoords = convertToPercentCoords({ x: item[0], y: 0 }, options);
    const xPxl = (percentCoords.x * generalWidth) / 100;

    if (percentCoords.x >= leftBorder && percentCoords.x <= rightBorder) {
      orderNumber += 1;

      if (orderNumber === 0 && array[index - 1] !== undefined) {
        setState(array[index - 1]);
      }

      setState(item);

      if (xPxl >= minX) {
        result.areaUnitValuesX.push(item[0]);
      }
    } else if (orderNumber !== -1) {
      setState(item);
      orderNumber = -1;
    }

    if (xPxl >= minX) {
      minX = xPxl + options.gapX;
    }
  });

  return result;
}
