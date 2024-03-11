import { CropElementsEventData, CropElementsEventDataOnDrag } from './crop.internal-model';

export function getAdjustedValueAfterScaled(value: number, newScale: number, oldScale: number) {
  return (value * newScale) / oldScale;
}

export function isCropResizeDragEventData(
  eventData: CropElementsEventData | CropElementsEventDataOnDrag
): eventData is CropElementsEventDataOnDrag {
  return !!(
    eventData.event.movementXFromPress &&
    eventData.event.movementYFromPress &&
    eventData.event.movementXFromStart &&
    eventData.event.movementYFromStart
  );
}
