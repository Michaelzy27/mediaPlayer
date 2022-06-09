import { get } from 'lodash';

export const stringSortDesc = (c1: any, c2: any) => (c1 > c2 ? -1 : 1);
export const numberSort = (c1: any, c2: any) => c1 < c2;
export const numberSortDesc = (c1: any, c2: any) => c1 > c2;

export const getDistinctValues = <T>(
  objArray: Array<any>,
  propName: string
): Array<T> => {
  return objArray
    ? [
        ...new Set(
          objArray.map((c: any) => {
            return c[propName];
          })
        ),
      ].sort()
    : [];
};

export const filterList = (
  list: any[],
  filterText: string | null | undefined,
  searchFields: string[]
) => {
  if (!filterText || filterText.trim() === '') {
    return list;
  }
  return (
    list?.filter((item: any) =>
      // any of the search fields contain the search text
      searchFields.some((field) => {
        const fieldValue = get(item, field.split('.'), '');
        return (
          fieldValue.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
        );
      })
    ) || []
  );
};

export const getUniqueArray = <T>(
  arr: Array<T>,
  generateDistinguishKey: (item: T) => string
): Array<T> => {
  const seen: Record<string, boolean> = {};
  const res = arr.filter(function (item) {
    const uniqueKey = generateDistinguishKey(item);
    return seen.hasOwnProperty(uniqueKey) ? false : (seen[uniqueKey] = true);
  });
  return res;
};
