import { useMemo } from "react";

export const useSearch = <T>(
  data: T[],
  searchText: string,
  searchProps: (item: T) => string[]
) => {
  return useMemo(() => {
    const regex = new RegExp(searchText, "i");
    return data?.filter((item) =>
      searchProps(item).some((sp) => regex.test(sp))
    );
  }, [data, searchText, searchProps]);
};
