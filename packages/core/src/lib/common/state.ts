import { DeepPartial } from '../common/common.model';
import { deepClone, deepmerge } from './common.util';
import { create, Atom } from 'xoid';

export class State<T> {
  private readonly atom: Atom<T>;

  public get value() {
    return this.atom.value;
  }

  constructor(value: T) {
    this.atom = create(value);
  }

  public set(value: T) {
    this.atom.set(value);
  }

  public deepSet(value: DeepPartial<T>) {
    this.atom.set(deepmerge(this.atom.value, value));
  }

  public clone(): T {
    return deepClone(this.atom.value);
  }
}
