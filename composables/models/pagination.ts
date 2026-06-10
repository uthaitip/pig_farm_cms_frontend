export class Pagination<T> implements IPagination<T> {
    constructor(params: Partial<Pagination<T>>) {
        Object.assign(this, {
            page: 1,
            limit: 10,
            list: [],
            pages: 0,
            total: 0,
            ...params
        });
    }
}