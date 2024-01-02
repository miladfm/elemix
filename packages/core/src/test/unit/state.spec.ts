import { State } from '../../lib/common/state';

describe('Class - State', () => {
  let numberState: State<number>;
  let stringState: State<string>;
  let objState: State<{ users: Record<string, { name: string }> }>;

  beforeEach(() => {
    numberState = new State(0);
    stringState = new State('VALUE');
    objState = new State({ users: { user1: { name: 'USER1' }, user2: { name: 'USER2' } } });
  });

  it('should return the initialize value when new instance has created', () => {
    expect(numberState.value).toEqual(0);
    expect(stringState.value).toEqual('VALUE');
    expect(objState.value).toEqual({ users: { user1: { name: 'USER1' }, user2: { name: 'USER2' } } });
  });
  it('should override the value when set a new value', () => {
    numberState.set(5);
    stringState.set('VALUE 2');
    objState.set({ users: { user3: { name: 'USER3' } } });

    expect(numberState.value).toEqual(5);
    expect(stringState.value).toEqual('VALUE 2');
    expect(objState.value).toEqual({ users: { user3: { name: 'USER3' } } });
  });
  it('should merge the new value this current when deepSet has called', () => {
    const oldObjStateValue = objState.value;
    numberState.deepSet(5);
    stringState.deepSet('VALUE 2');
    objState.deepSet({ users: { user1: { name: 'USER1-1' }, user3: { name: 'USER3' } } });

    expect(numberState.value).toEqual(5);
    expect(stringState.value).toEqual('VALUE 2');
    expect(objState.value).toEqual({ users: { user1: { name: 'USER1-1' }, user2: { name: 'USER2' }, user3: { name: 'USER3' } } });
    expect(objState.value).toHaveNotDeepInstances(oldObjStateValue);
  });
  it('should return a deep clone of the value when clone method has called', () => {
    const previousValue = objState.value;
    const clonedValue = objState.clone();

    expect(previousValue).toEqual(clonedValue);
    expect(previousValue).toHaveNotDeepInstances(clonedValue);
  });
});
