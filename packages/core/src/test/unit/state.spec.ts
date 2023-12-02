import { State } from '../../lib/common/state';
import { Callback } from '../../lib/common/common.model';
import { deepClone } from '../../lib/common/common.util';

// region --- MOCKS ---
jest.mock('../../lib/common/common.util', () => ({
  deepmerge: jest.fn().mockImplementation((target, source) => source),
  deepClone: jest.fn().mockImplementation((obj) => ({ ...obj })),
}));
// endregion

describe('Class - State', () => {
  let state: State<number>;
  let mockCallback: jest.MockedFunction<Callback<number>>;

  beforeEach(() => {
    mockCallback = jest.fn();
    state = new State(0);
  });

  it('should initialize correctly when passed a valid value', () => {
    expect(state.value).toBe(0);
  });

  it('should initialize correctly when passed a undefined value', () => {
    const stateUndefined = new State(undefined);
    expect(stateUndefined.value).toBeUndefined();
  });

  it('should override the value when set a new value', () => {
    state.set(5);
    expect(state.value).toBe(5);
  });

  it('should register a value change listener when a valid callback function is provided', () => {
    const callbacks = (state as any).callbacks as Set<unknown>;
    state.addListener(mockCallback);
    expect(callbacks.size).toBe(1);
  });

  it('should not register a value change listener twice when a the same register callback function is provided', () => {
    const callbacks = (state as any).callbacks as Set<unknown>;
    state.addListener(mockCallback);
    state.addListener(mockCallback);
    expect(callbacks.size).toBe(1);
  });

  it('should unregister a value change listener when a registered callback function is provided', () => {
    const callbacks = (state as any).callbacks as Set<unknown>;
    state.addListener(mockCallback);
    state.removeListener(mockCallback);
    expect(callbacks.size).toBe(0);
  });

  it('should not throw an error on removeListener when a unregistered callback function is provided', () => {
    expect(() => state.removeListener(jest.fn())).not.toThrow();
  });

  it('should invoke the value change listener callback when a new value is set', () => {
    state.addListener(mockCallback);
    state.set(2);
    expect(mockCallback).toHaveBeenCalledWith(2);
  });

  it('should invoke the value change listener callback when the value is updated', () => {
    state.addListener(mockCallback);
    state.update((value) => value + 1);
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  it('should invoke the multiple value change listener callbacks when the value is updated', () => {
    const anotherMockCallback = jest.fn();
    state.addListener(mockCallback);
    state.addListener(anotherMockCallback);

    state.set(4);

    expect(mockCallback).toHaveBeenCalledWith(4);
    expect(anotherMockCallback).toHaveBeenCalledWith(4);
  });

  it('should remove the value change listener when the callback function has already registered', () => {
    state.addListener(mockCallback);
    state.removeListener(mockCallback);
    state.set(3);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not throw an error on updating when no listeners are registered', () => {
    expect(() => {
      state.set(1);
      state.update((value) => value + 1);
    }).not.toThrow();
  });

  it('should not emit the change event when manualEmitter is true and the value is overridden', () => {
    const stateManual = new State(0, { manualEmitter: true });
    stateManual.addListener(mockCallback);

    stateManual.set(2);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should emit the change event when manualEmitter is true, the value is overridden, and the emit method is called', () => {
    const stateManual = new State(0, { manualEmitter: true });
    stateManual.addListener(mockCallback);

    stateManual.set(2);
    stateManual.emit();
    expect(mockCallback).toHaveBeenCalledWith(2);
  });

  it('should not emit the change event when manualEmitter is true and the value is updated', () => {
    const stateManual = new State(0, { manualEmitter: true });
    stateManual.addListener(mockCallback);

    stateManual.update((value) => value + 1);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should emit the change event when manualEmitter is true, the value is updated, and the emit method is called', () => {
    const stateManual = new State(0, { manualEmitter: true });
    stateManual.addListener(mockCallback);

    stateManual.update((value) => value + 1);
    stateManual.emit();
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  it('should not emit change event when manualEmitter is set to false and emit method has called', () => {
    state.addListener(mockCallback);
    state.emit();
    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should return a deep clone of the value when clone method has called', () => {
    const initialValue = { a: { b: 1 }, c: 2 };
    const stateObject = new State<typeof initialValue>(deepClone(initialValue));

    const clonedValue = stateObject.clone();

    expect(clonedValue).toEqual(initialValue);
    expect(clonedValue).not.toBe(initialValue); // Checks for a different object reference
  });
});
