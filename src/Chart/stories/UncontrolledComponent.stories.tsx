import React, { useState, useEffect, useMemo } from 'react';

import type { ComponentStory, Meta } from '@storybook/react';

import ChartComponent from '..';

export default {
  title: 'Chart',
  component: ChartComponent,
} as Meta<any>;

const years = 20;

const periods = [
  { id: 0, name: 'всё время' },
  { id: 1, name: 'день' },
  { id: 2, name: 'неделя' },
  { id: 3, name: 'месяц' },
  { id: 4, name: 'квартал' },
  { id: 5, name: 'полгода' },
  { id: 6, name: 'год' },
];

/**
 * Генерирует случайное число на основе заданного диапазона чисел
 */
const randomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const useFilterData = (id: number, data: number[][]) => {
  return useMemo(() => {
    const date = new Date();

    if (id === 1) {
      const day = date.setHours(date.getHours() - 24);
      return data.filter(([x]) => x >= day);
    }

    if (id === 2) {
      const week = date.setHours(date.getHours() - 24 * 7);
      return data.filter(([x]) => x >= week);
    }

    if (id === 3) {
      const month = date.setMonth(date.getMonth() - 1);
      return data.filter(([x]) => x >= month);
    }

    if (id === 4) {
      const quarter = date.setMonth(date.getMonth() - 3);
      return data.filter(([x]) => x >= quarter);
    }

    if (id === 5) {
      const halfYear = date.setMonth(date.getMonth() - 6);
      return data.filter(([x]) => x >= halfYear);
    }

    if (id === 6) {
      const year = date.setFullYear(date.getFullYear() - 1);
      return data.filter(([x]) => x >= year);
    }

    return data;
  }, [id, data]);
};

const getDate = (timestamp: number) => {
  return new Date(timestamp).toISOString();
};

const getElement = (num: number) => {
  const date = new Date();
  const year = date.setFullYear(date.getFullYear() - years);

  const x = getDate(year + 1000 * 60 * 60 * 24 * num);
  const y = randomNumber(0 + num, 100 + num);

  return [x, y];
};

export const Chart: ComponentStory<typeof ChartComponent> = () => {
  const [data, setData] = useState(() => {
    return [...new Array(366 * years)].map((item, index) => getElement(index + 1));
  });

  const [scale, setScale] = useState(50);
  const [period, setPeriod] = useState(() => periods[0]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setData((prev) => [...prev, getElement(prev.length)]);
    }, 2000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const parsedData = useMemo(() => {
    return data.map(([x, y]) => [new Date(x).getTime(), y as number]);
  }, [data]);

  const filteredData = useFilterData(period.id, parsedData);

  const handleChangePeriod = (selectedPeriod: typeof period) => () => {
    setPeriod(selectedPeriod);
  };

  return (
    <div>
      {/* <p>{period.name}</p> */}

      <ChartComponent
        style={{ width: '100%', height: 500, background: '#F2F2F2' }}
        data={filteredData}
        padding={150}
        scale={scale}
        animation={10}
        // eslint-disable-next-line react/no-unstable-nested-components
        tooltip={([x, y]) => (
          <div
            style={{
              maxWidth: 200,
              padding: 20,
              marginTop: -20,
              marginLeft: 20,
              background: 'white',
              transform: 'translateY(-100%)',
            }}
          >
            <p>
              {new Date(x).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p>
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(y)}
            </p>
          </div>
        )}
      />

      <p>Период ({period.name})</p>

      {periods.map((item) => (
        <button key={item.id} type="button" onClick={handleChangePeriod(item)}>
          {item.name}
        </button>
      ))}

      <p>Масштаб ({scale})</p>

      <button type="button" onClick={() => setScale((prev) => prev - 1)}>
        -
      </button>

      <button type="button" onClick={() => setScale((prev) => prev + 1)}>
        +
      </button>
    </div>
  );
};
