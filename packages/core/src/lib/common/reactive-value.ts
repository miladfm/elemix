import { Callback } from '../common/common.model';
import { deepClone, deepmerge } from './common.util';

export interface ReactiveValueOption {
  manualEmitter: boolean;
}
export class ReactiveValue<T> {
  private _value: T;
  private callbacks = new Set<Callback<T>>();
  private options: ReactiveValueOption = {
    manualEmitter: false,
  };

  public get value() {
    return this._value;
  }

  constructor(_value: T, options: Partial<ReactiveValueOption> = {}) {
    this.options = deepmerge(this.options, options);
    this._value = _value;
  }

  public set(_value: T) {
    this._value = _value;

    if (!this.options.manualEmitter) {
      this.emit();
    }
  }

  public update(fn: (value: T) => T) {
    this._value = fn(this._value);

    if (!this.options.manualEmitter) {
      this.emit();
    }
  }

  public addListener(fn: Callback<T>) {
    this.callbacks.add(fn);
  }

  public removeListener(fn: Callback<T>) {
    this.callbacks.delete(fn);
  }

  public emit() {
    this.callbacks.forEach((callback) => callback(this._value));
  }

  public clone(): T {
    return deepClone(this._value);
  }
}
