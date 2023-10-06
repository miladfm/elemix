import { toStr } from './ensure.util';

describe('toStr function', () => {
  it('should convert number to string', () => {
    expect(toStr(123)).toBe('123');
  });

  it('should convert boolean to string', () => {
    expect(toStr(true)).toBe('true');
    expect(toStr(false)).toBe('false');
  });

  it('should convert null to string', () => {
    expect(toStr(null)).toBe('null');
  });

  it('should convert undefined to string', () => {
    expect(toStr(undefined)).toBe('undefined');
  });

  it('should convert object to string', () => {
    expect(toStr({ a: 1 })).toBe('[object Object]');
  });

  it('should keep string as string', () => {
    expect(toStr('abc')).toBe('abc');
  });
});
