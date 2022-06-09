import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { filterList } from 'utils/array';

const useListFilter = (
  list: Array<any>,
  searchFields: Array<string>,
  debounceTimeout = 300
) => {
  const [filterText, setFilterTextInternal] = useState<string>('');

  const setFilterText = debounce((filterText: string) => {
    setFilterTextInternal(filterText);
  }, debounceTimeout);

  const filteredList = useMemo(() => {
    return filterList(list, filterText, searchFields);
  }, [filterText, list, searchFields]);

  return { filterText, setFilterText, filteredList };
};

export default useListFilter;
