import {
  normalizeQueriesWithAndSearch,
  normalizeQueriesWithOrSearch,
  removeEmpty
} from './objectUtils';
import { ILike } from 'typeorm';

describe('ObjectUtils', () => {
  describe('removeEmpty', () => {
    it('should remove empty null and undefined properties', () => {
      expect(
        removeEmpty({
          test: '1',
          test1: null,
          test2: undefined,
          test3: ''
        })
      ).toStrictEqual({ test: '1' });
    });
  });

  describe('normalizeQueriesWithOrSearch', () => {
    it('should create array of typeorm search', () => {
      const data = {
        lastname: 'test1',
        firstname: 'test2'
      };
      expect(normalizeQueriesWithOrSearch(data)).toStrictEqual([
        { lastname: ILike('%test1%') },
        { firstname: ILike('%test2%') }
      ]);
    });

    describe('normalizeQueriesWithAndSearch', () => {
      it('should create object of typeorm search', () => {
        const data = {
          lastname: 'test1',
          firstname: 'test2'
        };
        expect(normalizeQueriesWithAndSearch(data)).toStrictEqual({
          lastname: ILike('%test1%'),
          firstname: ILike('%test2%')
        });
      });
    });
  });
});
