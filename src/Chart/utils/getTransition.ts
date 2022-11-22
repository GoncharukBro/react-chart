export default function getTransition(
  animation: number,
  transition: number,
  ...other: [current: number, prev: number, next: number][]
) {
  return other.map((item) => {
    // Определяем направления движения анимации перемещения для каждой оси
    const sign = item[2] >= item[1] ? 1 : -1;
    // Определяем разницу в пикселях между предыдущей и текущей координатой для каждой оси
    const segment = Math.abs(item[2] - item[1]);
    // Вычисляем текущее положение маркера по линии графика
    return item[1] === -1 ? item[0] : item[1] + (segment / (animation * sign)) * transition;
  });
}
