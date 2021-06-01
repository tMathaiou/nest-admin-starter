export function tryCatch<T, U = any>(
  promise: Promise<T>
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err) => [err, undefined]);
}

export default tryCatch;
