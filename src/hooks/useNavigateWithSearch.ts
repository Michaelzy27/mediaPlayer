import {
  createSearchParams,
  NavigateOptions,
  Path,
  To,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

export type ToWithSearch =
  | string
  | {
      pathname: Path['pathname'];
      search?: Path['search'] | { [k: string]: any };
      hash?: Path['hash'];
    };

const useNavigateWithSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentSearch = searchParams.toString();
  return (to: ToWithSearch, options?: NavigateOptions) => {
    if (typeof to === 'string') {
      navigate(
        {
          pathname: to,
          search: currentSearch,
        },
        options
      );
    } else {
      const newTo: To = {
        pathname: to.pathname,
        search: currentSearch,
        hash: to.hash,
      };
      if (to.search) {
        if (typeof to.search === 'string') {
          newTo.search = to.search;
        } else {
          newTo.search = createSearchParams(to.search).toString();
        }
      }
      navigate(newTo, options);
    }
  };
};

export default useNavigateWithSearch;
