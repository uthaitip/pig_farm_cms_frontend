export class BaseMenu {
    name?: string;
    path?: string;
    icon?: string;
    children?: BaseMenu[];
    
    constructor(params: Partial<BaseMenu>) {
        Object.assign(this, params);
    }
}