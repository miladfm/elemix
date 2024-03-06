import { OperatorFunction, scan } from 'rxjs';
import { Animation, GesturesEventType } from '@elemix/core';
import { DragEvent } from '@elemix/drag';
import { CropDragEvent, CropElements } from './crop.internal-model';

// region PUBLIC
export function captureTransformOnPress(elements: CropElements): OperatorFunction<DragEvent, CropDragEvent> {
  const backdropWrapperAnimation = Animation.getOrCreateInstance(elements.backdropWrapper);
  const imageAnimation = Animation.getOrCreateInstance(elements.image);

  return scan<DragEvent, CropDragEvent>((acc, event) => {
    if (event.type === GesturesEventType.DragPress) {
      const image = { ...imageAnimation.value.transform };
      const backdropWrapper = { ...backdropWrapperAnimation.value.transform };
      return { event, transformOnPress: { backdropWrapper, image } };
    }
    return { ...acc, event };
  }, {} as CropDragEvent);
}
// endregion
