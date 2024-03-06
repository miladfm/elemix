export function getAdjustedValueAfterScaled(value: number, newScale: number, oldScale: number) {
  return (value * newScale) / oldScale;
}
