import { ReactiveValue } from '../../lib/common/reactive-value';
import { Callback } from '../../lib/common/common.model';
import { deepClone } from '../../lib/common/common.util';

// region --- MOCKS ---
jest.mock('../../lib/common/common.util', () => ({
  deepmerge: jest.fn().mockImplementation((target, source) => source),
  deepClone: jest.fn().mockImplementation((obj) => ({ ...obj })),
}));
// endregion

describe('Class - ReactiveValue', () => {
  let reactiveValue: ReactiveValue<number>;
  let mockCallback: jest.MockedFunction<Callback<number>>;

  beforeEach(() => {
    mockCallback = jest.fn();
    reactiveValue = new ReactiveValue(0);
  });

  it('should initialize correctly when passed a valid value', () => {
    expect(reactiveValue.value).toBe(0);
  });

  it('should initialize correctly when passed a undefined value', () => {
    const reactiveUndefined = new ReactiveValue(undefined);
    expect(reactiveUndefined.value).toBeUndefined();
  });

  it('should override the value when set a new value', () => {
    reactiveValue.set(5);
    expect(reactiveValue.value).toBe(5);
  });

  it('should register a value change listener when a valid callback function is provided', () => {
    const callbacks = (reactiveValue as any).callbacks as Set<unknown>;
    reactiveValue.addListener(mockCallback);
    expect(callbacks.size).toBe(1);
  });

  it('should not register a value change listener twice when a the same register callback function is provided', () => {
    const callbacks = (reactiveValue as any).callbacks as Set<unknown>;
    reactiveValue.addListener(mockCallback);
    reactiveValue.addListener(mockCallback);
    expect(callbacks.size).toBe(1);
  });

  it('should unregister a value change listener when a registered callback function is provided', () => {
    const callbacks = (reactiveValue as any).callbacks as Set<unknown>;
    reactiveValue.addListener(mockCallback);
    reactiveValue.removeListener(mockCallback);
    expect(callbacks.size).toBe(0);
  });

  it('should not throw an error on removeListener when a unregistered callback function is provided', () => {
    expect(() => reactiveValue.removeListener(jest.fn())).not.toThrow();
  });

  it('should invoke the value change listener callback when a new value is set', () => {
    reactiveValue.addListener(mockCallback);
    reactiveValue.set(2);
    expect(mockCallback).toHaveBeenCalledWith(2);
  });

  it('should invoke the value change listener callback when the value is updated', () => {
    reactiveValue.addListener(mockCallback);
    reactiveValue.update((value) => value + 1);
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  it('should invoke the multiple value change listener callbacks when the value is updated', () => {
    const anotherMockCallback = jest.fn();
    reactiveValue.addListener(mockCallback);
    reactiveValue.addListener(anotherMockCallback);

    reactiveValue.set(4);

    expect(mockCallback).toHaveBeenCalledWith(4);
    expect(anotherMockCallback).toHaveBeenCalledWith(4);
  });

  it('should remove the value change listener when the callback function has already registered', () => {
    reactiveValue.addListener(mockCallback);
    reactiveValue.removeListener(mockCallback);
    reactiveValue.set(3);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not throw an error on updating when no listeners are registered', () => {
    expect(() => {
      reactiveValue.set(1);
      reactiveValue.update((value) => value + 1);
    }).not.toThrow();
  });

  it('should not emit the change event when manualEmitter is true and the value is overridden', () => {
    const manualReactiveValue = new ReactiveValue(0, { manualEmitter: true });
    manualReactiveValue.addListener(mockCallback);

    manualReactiveValue.set(2);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should emit the change event when manualEmitter is true, the value is overridden, and the emit method is called', () => {
    const manualReactiveValue = new ReactiveValue(0, { manualEmitter: true });
    manualReactiveValue.addListener(mockCallback);

    manualReactiveValue.set(2);
    manualReactiveValue.emit();
    expect(mockCallback).toHaveBeenCalledWith(2);
  });

  it('should not emit the change event when manualEmitter is true and the value is updated', () => {
    const manualReactiveValue = new ReactiveValue(0, { manualEmitter: true });
    manualReactiveValue.addListener(mockCallback);

    manualReactiveValue.update((value) => value + 1);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should emit the change event when manualEmitter is true, the value is updated, and the emit method is called', () => {
    const manualReactiveValue = new ReactiveValue(0, { manualEmitter: true });
    manualReactiveValue.addListener(mockCallback);

    manualReactiveValue.update((value) => value + 1);
    manualReactiveValue.emit();
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  it('should not emit change event when manualEmitter is set to false and emit method has called', () => {
    reactiveValue.addListener(mockCallback);
    reactiveValue.emit();
    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should return a deep clone of the value when clone method has called', () => {
    const initialValue = { a: { b: 1 }, c: 2 };
    const reactiveObject = new ReactiveValue<typeof initialValue>(deepClone(initialValue));

    const clonedValue = reactiveObject.clone();

    expect(clonedValue).toEqual(initialValue);
    expect(clonedValue).not.toBe(initialValue); // Checks for a different object reference
  });
});
