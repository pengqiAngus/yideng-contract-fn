import { useCallback, useState } from 'react';
import { produce, Draft, freeze } from 'immer';
export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];
//函数的签名
export function useImmer<S = unknown>(initialValue: S | (() => S)): ImmerHook<S>;
export function useImmer<T>(initialValue: T) {
  const [val, updateValue] = useState(() =>
    //原来初始化的对象 不能动了
    freeze(typeof initialValue === 'function' ? initialValue() : initialValue, true),
  );

  return [
    val,
    useCallback((updater: T | DraftFunction<T>) => {
      if (typeof updater === 'function') {
        updateValue(produce(updater as DraftFunction<T>));
      } else {
        updateValue(freeze(updater));
      }
    }, []),
  ];
}
