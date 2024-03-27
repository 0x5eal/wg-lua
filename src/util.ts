export function slice<T extends defined>(arr: T[], start: number, stop?: number): T[] {
  const length = arr.size();

  if (start < 0) {
    start = math.max(length + start, 0);
  }

  if (stop === undefined) {
    stop = length;
  } else if (stop < 0) {
    stop = math.max(length + stop, 0);
  }

  const result: T[] = [];

  for (let i = start; i < stop; i++) {
    result.push(arr[i]);
  }

  return result;
}
