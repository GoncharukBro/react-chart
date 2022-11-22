import { useCallback } from 'react';

export default function useConnectRef() {
  return useCallback((...refs: React.Ref<HTMLElement>[]) => {
    return (element: any | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(element);
        } else if (typeof ref === 'object' && ref !== null) {
          // eslint-disable-next-line no-param-reassign
          (ref.current as any) = element;
        }
      });
    };
  }, []);
}
