export type Tooltip = React.ReactNode | ((coord: number[]) => React.ReactNode);

export interface Options {
  canvasWidth: number;
  canvasHeight: number;
  generalWidth: number;
  generalData: number[][];
  generalMinX: number;
  generalMaxX: number;
  areaWidth: number;
  areaHeight: number;
  areaData: number[][];
  areaMinY: number;
  areaMaxY: number;
  areaUnitValuesX: number[];
  gapX: number;
  gapY: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  scale: number | undefined;
  animation: number;
}
