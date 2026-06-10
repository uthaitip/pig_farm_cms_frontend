export interface ICardItem {
    title?: String;
    code?: String;
    icon?: String;
    style?: String;
    heroIcon?: String;
    svgIcon?: String;
    order?: number;
    details?: ICardItemData[];
    actions?: ICardItemAction[];
}

export interface ICardItemData {
    title?: String;
    style?: String;
    code?: String;
    value?: String;
}

export interface ICardItemAction {
    code?: String;
    title?: String;
    style?: String;
    onClick?: () => void
}

export class CardItem implements ICardItem {
    constructor(params: Partial<ICardItem>) {
        Object.assign(this, {
            title: undefined,
            code: undefined,
            icon: undefined,
            style: "",
            heroIcon: undefined,
            svgIcon: undefined,
            order: 99,
            details: [],
            actions: [],
            ...params
        });
    }
}

export class CardItemData implements ICardItemData {
    constructor(params: Partial<ICardItem>) {
        Object.assign(this, {
            title: undefined,
            code: undefined,
            value: undefined,
            style: "",
            ...params
        });
    }
}

export class CardItemAction implements ICardItemAction {
    constructor(params: Partial<ICardItem>) {
        Object.assign(this, {
            code: undefined,
            title: undefined,
            style: undefined,
            onClick: () => { },
            ...params
        });
    }
}