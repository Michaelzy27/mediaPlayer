import { getUniqueArray, getDistinctValues, filterList } from '../array';

describe('array utils', () => {
  let testArray = [] as any[];
  beforeAll(() => {
    testArray = [
      {
        id: 1,
        model: 'Ford',
        colour: 'blue',
      },
      {
        id: 2,
        model: 'Nissan',
        colour: 'white',
      },
      {
        id: 3,
        model: 'Nissan',
        colour: 'blue',
      },
      {
        id: 4,
        model: 'Toyota',
        colour: 'white',
      },
      {
        id: 5,
        model: 'Volkswagen',
        colour: 'red',
      },
      {
        id: 6,
        model: "Can't afford a BMW",
        colour: 'black',
      },
      {
        id: 7,
        model: 'Mercedes',
        colour: 'cherry red',
      },
      {
        id: 8,
        model: 'Cherry',
        colour: 'white',
      },
    ];
  });

  describe('getDistinctValues', () => {
    test('returns distinct values from an array of objects', () => {
      expect(getDistinctValues(testArray, 'colour')).toEqual([
        'black',
        'blue',
        'cherry red',
        'red',
        'white',
      ]);
      expect(getDistinctValues(testArray, 'model')).toEqual([
        "Can't afford a BMW",
        'Cherry',
        'Ford',
        'Mercedes',
        'Nissan',
        'Toyota',
        'Volkswagen',
      ]);
    });
  });

  describe('filterList', () => {
    test('filters objects by search terms', () => {
      let result = filterList(testArray, 'FoRd', ['model']);
      expect(result.map((r: any) => r.id)).toEqual([1, 6]);

      result = filterList(testArray, 'cherry', ['model']);
      expect(result.map((r: any) => r.id)).toEqual([8]);

      result = filterList(testArray, 'Cherry', ['model', 'colour']);
      expect(result.map((r: any) => r.id)).toEqual([7, 8]);

      result = filterList(testArray, 'white', ['colour']);
      expect(result.map((r: any) => r.id)).toEqual([2, 4, 8]);

      result = filterList(testArray, 'jibberish', ['colour', 'model']);
      expect(result).toEqual([]);
    });

    test('returns entire list when no search term', () => {
      expect(filterList(testArray, '   ', ['colour'])).toEqual(testArray);
    });
  });

  describe('getUniqueArray', () => {
    test.each([
      [['ghost', 'comparison', 'guitar', 'glass', 'square']],
      [['ghost', 'comparison', 'ghost', 'guitar', 'glass', 'square']], // randomly duplicate a string
      [['ghost', 'ghost', 'comparison', 'ghost', 'guitar', 'glass', 'square']], // randomly duplicate a string twice
      [
        [
          'ghost',
          'comparison',
          'ghost',
          'guitar',
          'glass',
          'square',
          'glass',
          'guitar',
        ],
      ], // randomly duplicate multi strings
    ])('positive case - get unique array of %p', async (arr) => {
      await expect(getUniqueArray(arr, (item: string) => item)).toEqual([
        'ghost',
        'comparison',
        'guitar',
        'glass',
        'square',
      ]);
    });
  });
});
