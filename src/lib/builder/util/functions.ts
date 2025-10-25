// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function once<T extends (this: any, ...args: any[]) => void>(fn: T) {
  let hasBeenCalled = false;

  return function (this: ThisType<T>, ...params: Parameters<T>) {
    if (!hasBeenCalled) {
      hasBeenCalled = true;
      fn.call(this, ...params);
    }
  };
}
