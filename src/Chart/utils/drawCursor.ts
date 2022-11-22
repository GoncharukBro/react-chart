/* eslint-disable no-param-reassign */

import convertToPercentCoords from './convertToPercentCoords';
import convertToPixelCoords from './convertToPixelCoords';
import applyTranslate from './applyTranslate';

import getTransition from '../utils/getTransition';

import type { Options } from '../types';

export default function drawCursor(
  showLinesX: boolean,
  showLinesY: boolean,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  translate: React.MutableRefObject<{ prev: number; next: number }>,
  activeCoord: React.MutableRefObject<{
    item: number[] | null;
    prev: { x: number; y: number };
    next: { x: number; y: number };
    transition: number;
  }>,
  interactive: React.MutableRefObject<{
    active: boolean;
    enable: boolean;
    show: boolean;
    touch: boolean;
    touchStart: number;
    clientX: number;
    clientY: number;
  }>,
  options: Options
) {
  if (ctx.current === null || !interactive.current.active) return;

  const {
    canvasWidth,
    canvasHeight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    animation,
  } = options;

  let activeItem = null;

  let activeX = 0;
  let activeY = 0;

  // Находим координату ближайшую к положению курсора
  options.areaData.forEach((item, index) => {
    const percentCoords = convertToPercentCoords({ x: item[0], y: item[1] }, options);
    const pixelCoords = convertToPixelCoords(percentCoords, options);

    const { x, y } = applyTranslate(translate.current.next, pixelCoords, options);

    if (
      index === 0 ||
      Math.abs(interactive.current.clientX - x) < Math.abs(interactive.current.clientX - activeX)
    ) {
      activeItem = item;
      activeX = x;
      activeY = y;
    }
  });

  const x = Math.floor(activeX);
  const y = Math.floor(activeY);

  // Сейчас каждый отрезок на графике делится на равное количество сегментов для анимации
  // это приводит к одному времени завершения анимации, но к разной скорости анимации
  // закоментированный код позволяет добится одинковой скорости анмации (такое решение под вопросом)
  // const speed = 1;
  // const animation = Math.sqrt(segmentX ** 2 + segmentY ** 2) / speed;
  // Код ниже необходим для создания анимации при переходе между активными точками координат
  // Кэшируем состояние найденной координаты в пикселях
  if (activeCoord.current.next.x !== x || activeCoord.current.next.y !== y) {
    activeCoord.current.item = activeItem;
    activeCoord.current.prev.x = activeCoord.current.next.x;
    activeCoord.current.prev.y = activeCoord.current.next.y;
    activeCoord.current.next.x = x;
    activeCoord.current.next.y = y;
    activeCoord.current.transition = 1;
  }

  const [transitionX, transitionY] = getTransition(
    animation,
    activeCoord.current.transition,
    [x, activeCoord.current.prev.x, activeCoord.current.next.x],
    [y, activeCoord.current.prev.y, activeCoord.current.next.y]
  );

  const show =
    interactive.current.show &&
    transitionX >= paddingLeft &&
    transitionX <= canvasWidth - paddingRight &&
    transitionY >= paddingTop &&
    transitionY <= canvasHeight - paddingBottom;

  // Рисуем вертикальную линию по маркеру
  if (showLinesX) {
    ctx.current.beginPath();
    // Устанавливаем стили линии по маркеру
    ctx.current.lineWidth = 1;
    ctx.current.strokeStyle = '#000000';
    ctx.current.setLineDash([10, 10]);
    ctx.current.moveTo(transitionX, paddingTop);
    ctx.current.lineTo(transitionX, canvasHeight - paddingBottom);
    if (show) ctx.current.stroke();
    ctx.current.setLineDash([]);
    ctx.current.closePath();
  }

  // Рисуем горизонтальную линию по маркеру
  if (showLinesY) {
    ctx.current.beginPath();
    // Устанавливаем стили линии по маркеру
    ctx.current.lineWidth = 1;
    ctx.current.strokeStyle = '#000000';
    ctx.current.setLineDash([10, 10]);
    ctx.current.moveTo(paddingLeft, transitionY);
    ctx.current.lineTo(canvasWidth - paddingRight, transitionY);
    if (show) ctx.current.stroke();
    ctx.current.setLineDash([]);
    ctx.current.closePath();
  }

  // Рисуем маркер
  ctx.current.beginPath();
  // Устанавливаем стили маркера
  ctx.current.lineWidth = 1;
  ctx.current.fillStyle = '#000000';
  ctx.current.arc(transitionX, transitionY, 15, 0, Math.PI * 2);
  if (show) ctx.current.fill();
  ctx.current.closePath();

  // Обновляем состояние перехода анимации
  if (activeCoord.current.transition < animation) {
    activeCoord.current.transition += 1;
  }
}
