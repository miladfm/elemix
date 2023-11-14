# Gestures Events

This documentation provides an in-depth guide to the behavior and intricacies of events within the `Gestures` class.
Developers can quickly understand the conditions under which each event is dispatched.

## Events

| Event        | Description                                                                                                                                 | Example                                                                                                                      |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| Press        | Dispatched when pointerdown is triggered and the number of active touches is 1.                                                             | A user places a single finger on the screen.                                                                                 |
|              | Not dispatched if the number of active touches is greater than 1.	                                                                          | A user places a second finger on the screen without lifting the first.                                                       |
| PressRelease | Dispatched when pointerup or pointercancel is triggered and the number of active touches is 0, but only if Press was previously dispatched. | A user lifts off the only finger used for Press.                                                                             |
|              | Not dispatched if the number of active touches is greater than 0 or if Press was not previously dispatched.                                 | A user lifts one finger but another is still in contact with the screen, or the Press event never occurred.                  |
| DragPress    | Dispatched when pointerdown is triggered and the number of active touches is 1.                                                             | A user taps and holds the screen with one finger.                                                                            |
| DragStart    | Dispatched on pointermove if X or Y-axis movement is greater than minMovement and the number of active touches is 1.                        | A user moves their finger beyond the minMovement threshold.                                                                  |
|              | Dispatched on pointermove when one pointer is released during Zoom, leaving one pointer. No minMovement check required.                     | During a zoom gesture with two fingers, one finger is lifted, leaving one active finger on the screen.                       |
|              | Not dispatched if the number of active touches is not 1 or if DragPress was not previously dispatched.                                      | A user moves their finger with multiple touches or without a preceding DragPress.                                            |
| Drag	        | Dispatched on pointermove when the number of active touches is 1, following a DragStart.                                                    | A user continues to drag their finger across the screen after a DragStart event.                                             |
| DragEnd      | Dispatched on pointerup or pointercancel if DragStart occurred and there are no more touches on the screen.                                 | A user lifts the dragging finger from the screen.                                                                            |
|              | Dispatched on pointerdown after DragStart emission (Dragging stops and Zooming starts).                                                     | A user starts a zoom gesture during dragging.                                                                                |
| DragRelease  | Dispatched on pointerup or pointercancel if DragPress occurred and the number of active touches is 0.	                                      | A user lifts their finger after a drag press and there are no more fingers on the screen.                                    |
| ZoomPress    | Dispatched when pointerdown is triggered and the number of active touches is 2.                                                             | A user places two fingers on the screen simultaneously.                                                                      |
| ZoomStart    | Dispatched on pointermove with the number of active touches being 2, following a ZoomPress.                                                 | A user moves two fingers apart or towards each other.                                                                        |
|              | Not dispatched if the number of active touches is not 2 or if ZoomPress was not previously dispatched.                                      | More or less than two fingers move or without a preceding ZoomPress.                                                         |
| Zoom	        | Dispatched on subsequent pointermove with the number of active touches being 2, after ZoomStart.                                            | A user continues the pinch or spread gesture.                                                                                |
| ZoomEnd      | Dispatched when pointerup or pointercancel is triggered and the number of active touches is not 2, after ZoomStart.                         | A user lifts or cancels one or both fingers after a zoom gesture.                                                            |
| ZoomRelease  | Dispatched when pointerup or pointercancel is triggered with the number of active touches being 1 or 0, after ZoomPress.                    | A user ends a zoom gesture with exactly one finger remaining on the screen or when there are no more fingers on the screen.  |


## How to use it
```typescript
import { Gestures } from '@elemix/core';

const gestures = new Gestures(elementOrSelector);

gestures.changes$.subscribe(gesturesEvent => {
  console.log(gesturesEvent.type)
  // Add your logic;
})
```