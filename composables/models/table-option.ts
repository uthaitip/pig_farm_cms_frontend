export interface ITableOption {
  field?: string;
  label?: string;
  sort?: boolean;
  headerAlign?: 'text-left' | 'text-center' | 'text-right' | string;
  dataAlign?: 'text-left' | 'text-center' | 'text-right' | string;
  width?: String;
  isKey?: boolean;
  hidden?: boolean;
}

export class TableOption implements ITableOption {
  constructor(params: Partial<TableOption>) {
    Object.assign(this, {
      sort: false,
      headerAlign: 'text-center',
      dataAlign: 'text-center',
      isKey: false,
      hidden: false,
      ...params
    });
  }
}
