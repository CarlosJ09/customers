export interface ResponseWithPagination<T> {
  next?: string;
  previous?: string;
  count: number;
  results: T[];
}
