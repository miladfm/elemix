export function clamp(value: number, [minBound, maxBound]: [number, number]): number {
  return Math.max(minBound, Math.min(value, maxBound));
}

export function average(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Number(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)).toFixed(2));
}
