import { Dom, DragGesturesEvent, Gestures, GesturesEvent, GesturesEventType } from '@elemix/core';
import { filter, map, merge, Observable } from 'rxjs';
import { CropElementsEventData, CropHDirection, CropVDirection } from './crop.internal-model';

// region PUBLIC
export function getCropElementsEvent(wrapper: Dom): Observable<CropElementsEventData> {
  const draggableTop = new Dom('.crop__draggable--top', wrapper.nativeElement);
  const draggableRight = new Dom('.crop__draggable--right', wrapper.nativeElement);
  const draggableBottom = new Dom('.crop__draggable--bottom', wrapper.nativeElement);
  const draggableLeft = new Dom('.crop__draggable--left', wrapper.nativeElement);

  const draggableTopLeft = new Dom('.crop__draggable--top-left', wrapper.nativeElement);
  const draggableTopRight = new Dom('.crop__draggable--top-right', wrapper.nativeElement);
  const draggableBottomRight = new Dom('.crop__draggable--bottom-right', wrapper.nativeElement);
  const draggableBottomLeft = new Dom('.crop__draggable--bottom-left', wrapper.nativeElement);

  return merge<[GesturesEvent, CropVDirection | null, CropHDirection | null][]>(
    new Gestures(draggableTop).changes$.pipe(map((e) => [e, CropVDirection.Top, null])),
    new Gestures(draggableBottom).changes$.pipe(map((e) => [e, CropVDirection.Bottom, null])),
    new Gestures(draggableLeft).changes$.pipe(map((e) => [e, null, CropHDirection.Left])),
    new Gestures(draggableRight).changes$.pipe(map((e) => [e, null, CropHDirection.Right])),
    new Gestures(draggableTopLeft).changes$.pipe(map((e) => [e, CropVDirection.Top, CropHDirection.Left])),
    new Gestures(draggableTopRight).changes$.pipe(map((e) => [e, CropVDirection.Top, CropHDirection.Right])),
    new Gestures(draggableBottomLeft).changes$.pipe(map((e) => [e, CropVDirection.Bottom, CropHDirection.Left])),
    new Gestures(draggableBottomRight).changes$.pipe(map((e) => [e, CropVDirection.Bottom, CropHDirection.Right]))
  ).pipe(
    filter((eventData): eventData is [DragGesturesEvent, CropVDirection | null, CropHDirection | null] => isDragGesture(eventData[0])),
    map(([event, vDirection, hDirection]) => ({ event, vDirection, hDirection }))
  );
}
// endregion

// region HELPERS
function isDragGesture(e: GesturesEvent): e is DragGesturesEvent {
  return [
    GesturesEventType.DragPress,
    GesturesEventType.DragStart,
    GesturesEventType.Drag,
    GesturesEventType.DragEnd,
    GesturesEventType.DragRelease,
  ].includes(e.type);
}
// endregion
