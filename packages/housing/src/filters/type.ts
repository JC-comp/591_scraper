import type { FilterOption } from './option';

interface TypeFilter {
    type: number;
    name: string;
    [key: string]: number | string;
}

const TYPE: TypeFilter[] = [
    {
        "type": 1,
        "name": "出租"
    },
    {
        "type": 2,
        "name": "買賣"
    },
    {
        "type": 6,
        "name": "頂讓"
    }
]

export function getTypeList(): FilterOption[] {
    return TYPE.map(e => {
        return {
            id: e.type.toString(),
            key: 'type',
            name: e.name
        };
    });
}