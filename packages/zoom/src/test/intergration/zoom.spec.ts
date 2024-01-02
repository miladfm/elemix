import { Zoom } from '../../lib/zoom';

describe('Feature - Zoom', () => {
  it('should work', () => {
    expect(() => new Zoom()).not.toThrow();
  });
});
