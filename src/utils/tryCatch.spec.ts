import tryCatch from './tryCatch';

describe('tryCatch', () => {
  it('should resolve promise', async () => {
    const promise = new Promise((resolve) => resolve('hey'));

    const [err, result] = await tryCatch(promise);

    expect(err).toBe(null);
    expect(result).toBe('hey');
  });

  it('should reject promise', async () => {
    const promise = new Promise((promise, reject) => reject('err'));

    const [err, result] = await tryCatch(promise);

    expect(err).toBe('err');
    expect(result).toBe(undefined);
  });
});
