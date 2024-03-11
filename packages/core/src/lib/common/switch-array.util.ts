type SwitchArrayAction<T = void> = () => T;

interface SwitchArrayCase<T = void> {
  arrOrKey: any[];
  action: SwitchArrayAction<T>;
}

interface SwitchArrayCaseDefault<T = void> {
  arrOrKey: 'default';
  action: SwitchArrayAction<T>;
}

export function switchArray<T = void>(target: any[], case1: SwitchArrayCase<T>, defaultFn: SwitchArrayCaseDefault<T>): T;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  defaultFn: SwitchArrayCaseDefault<T>
): T;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  defaultFn: SwitchArrayCaseDefault<T>
): T;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  case5: SwitchArrayCase<T>,
  defaultFn: SwitchArrayCaseDefault<T>
): T;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  case5: SwitchArrayCase<T>,
  case6: SwitchArrayCase<T>,
  defaultFn: SwitchArrayCaseDefault<T>
): T;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  case5: SwitchArrayCase<T>,
  case6: SwitchArrayCase<T>,
  case7: SwitchArrayCase<T>,
  defaultFn: SwitchArrayCaseDefault<T>
): T;

export function switchArray<T = void>(target: any[], case1: SwitchArrayCase<T>): T | undefined;
export function switchArray<T = void>(target: any[], case1: SwitchArrayCase<T>, case2: SwitchArrayCase<T>): T | undefined;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>
): T | undefined;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  case5: SwitchArrayCase<T>
): T | undefined;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  case5: SwitchArrayCase<T>,
  case6: SwitchArrayCase<T>
): T | undefined;
export function switchArray<T = void>(
  target: any[],
  case1: SwitchArrayCase<T>,
  case2: SwitchArrayCase<T>,
  case3: SwitchArrayCase<T>,
  case5: SwitchArrayCase<T>,
  case6: SwitchArrayCase<T>,
  case7: SwitchArrayCase<T>
): T | undefined;

// export function switchArray<T = void>(target: any[], ...cases: (SwitchArrayCase<T> | SwitchArrayCaseDefault<T>)[]): T | undefined;
export function switchArray<T = void>(target: any[], ...cases: (SwitchArrayCase<T> | SwitchArrayCaseDefault<T>)[]): T | undefined {
  const matchingCase = cases.find(
    ({ arrOrKey }) =>
      Array.isArray(arrOrKey) &&
      target.length === arrOrKey.length &&
      arrOrKey.every((arrItem, index) => arrItem === 'any' || arrItem === target[index])
  );
  const defaultAction = () => cases.find(({ arrOrKey }) => arrOrKey === 'default')?.action();

  return matchingCase ? matchingCase.action() : defaultAction();
}

export function on<T = void>(arrOrKey: ('any' | any)[], action: SwitchArrayAction<T>): SwitchArrayCase<T>;
export function on<T = void>(arrOrKey: 'default', action: SwitchArrayAction<T>): SwitchArrayCaseDefault<T>;
export function on<T = void>(arrOrKey: 'default' | any[], action: SwitchArrayAction<T>): SwitchArrayCase<T> | SwitchArrayCaseDefault<T> {
  return { arrOrKey, action };
}
