export interface IResponse<T> {
  status?: number;
  message?: string;
  data?: T;
  errors?: any;
}

export interface IResponsePagination<T> {
  status?: number;
  message?: string;
  data?: IPagination<T>;
  errors?: any[];
}

export interface IPagination<T> {
  page?: number;
  limit?: number;
  list?: T[];
  pages?: number;
  total?: number;
  totalPages?: number;
}
