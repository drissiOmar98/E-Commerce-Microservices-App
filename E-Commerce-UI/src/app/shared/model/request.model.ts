import {HttpParams} from "@angular/common/http";

export interface Pagination {
  page: number;
  size: number;
  sort: string[];
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  sort: Sort;
  number: number;
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


export const createPaginationOption = (req: Pagination): HttpParams => {
  let params = new HttpParams();
  params = params.append("page", req.page).append("size", req.size);

  req.sort.forEach(value => {
    params = params.append("sort", value);
  });

  return params;
};

/**
 * Utility function to create an empty Page<T> object.
 * Useful for handling error scenarios or providing default values.
 */
export const emptyPage = <T>(): Page<T> => {
  return {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      offset: 0,
      paged: false,
      unpaged: true,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
    },
    last: true,
    totalElements: 0,
    totalPages: 0,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    number: 0,
    size: 0,
    first: true,
    numberOfElements: 0,
    empty: true,
  };
};
