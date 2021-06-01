import { FindOperator, ILike } from 'typeorm';

export function removeEmpty(obj: any): any {
  const output: any = {};
  Object.entries(obj).forEach(([key, val]): void => {
    if (val != null && val !== '' && val !== undefined) {
      output[key] = val;
    }
  });

  return output;
}

export function normalizeQueriesWithOrSearch(
  obj: any
): { [p: string]: FindOperator<string> }[] {
  return Object.entries(removeEmpty(obj)).map(([key, val]): {
    [p: string]: FindOperator<string>;
  } => {
    return {
      [key]: ILike(`%${val}%`)
    };
  });
}

export function normalizeQueriesWithAndSearch(obj: any): any {
  const output: any = {};
  Object.entries(removeEmpty(obj)).forEach(([key, val]): void => {
    output[key] = ILike(`%${val}%`);
  });

  return output;
}
