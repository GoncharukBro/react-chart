import { createContext, useContext as useReactContext } from 'react';

import type { Options } from './types';

interface ContextValue {
  container: React.RefObject<HTMLDivElement>;
  options: React.MutableRefObject<Options | null>;
  translate: React.MutableRefObject<{ prev: number; next: number }>;
}

const Context = createContext<ContextValue | undefined>(undefined);

export function ContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ContextValue;
}) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useContext() {
  const context = useReactContext(Context);

  if (context === undefined) {
    throw new Error('"useContext" должен использоваться совместно с "ContextProvider"');
  }

  return context;
}
