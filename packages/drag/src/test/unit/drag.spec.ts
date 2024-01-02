import { Drag } from '../../lib/drag';
import { Subscription } from 'rxjs';

describe('drag', () => {
  let element: HTMLElement;
  let drag: Drag;
  let gesturesSubscription: Subscription;

  beforeEach(() => {
    element = document.createElement('div');
    drag = new Drag(element);
    gesturesSubscription = (drag as any).gestureChangesSub;
  });

  it('should subscribe to gesture changes when the instance has created', () => {
    expect(gesturesSubscription).toBeDefined();
    expect(gesturesSubscription.closed).toEqual(false);
  });
  it('should subscribe to gesture changes when enable is called', () => {
    drag.disable();
    drag.enable();
    gesturesSubscription = (drag as any).gestureChangesSub;
    expect(gesturesSubscription).toBeDefined();
    expect(gesturesSubscription.closed).toEqual(false);
  });

  it('should not subscribe to gesture changes if already enabled when enable is called', () => {
    const oldGesturesSubscription = gesturesSubscription;
    drag.enable();
    gesturesSubscription = (drag as any).gestureChangesSub;
    expect(gesturesSubscription).toBe(oldGesturesSubscription);
  });
  it('should unsubscribe from gesture changes when disable is called', () => {
    drag.disable();
    gesturesSubscription = (drag as any).gestureChangesSub;
    expect(gesturesSubscription).toBeNull();
  });
  it('should not throw errors when disable is called without being enabled', () => {
    expect(() => {
      drag.disable();
      drag.disable();
    }).not.toThrowError();
  });

  it('', () => {});
});
