import type { State } from '@/state';
import type { FilterOption } from './option';

interface KindFilter {
    type: number;
    kind: number | string;
    name: string;
}

const KIND: KindFilter[] = [
    {
        "type": 1,
        "kind": "",
        "name": "租屋"
    },
    {
        "type": 1,
        "kind": 1,
        "name": "整層住家"
    },
    {
        "type": 1,
        "kind": 2,
        "name": "獨立套房"
    },
    {
        "type": 1,
        "kind": 3,
        "name": "分租套房"
    },
    {
        "type": 1,
        "kind": 4,
        "name": "雅房"
    },
    {
        "type": 1,
        "kind": 5,
        "name": "店面出租"
    },
    {
        "type": 2,
        "kind": 5,
        "name": "店面買賣"
    },
    {
        "type": 6,
        "kind": 5,
        "name": "店面頂讓"
    },
    {
        "type": 1,
        "kind": 6,
        "name": "辦公出租"
    },
    {
        "type": 2,
        "kind": 6,
        "name": "辦公買賣"
    },
    {
        "type": 1,
        "kind": 7,
        "name": "廠房出租"
    },
    {
        "type": 2,
        "kind": 7,
        "name": "廠房買賣"
    },
    {
        "type": 1,
        "kind": 8,
        "name": "車位"
    },
    {
        "type": 1,
        "kind": 11,
        "name": "土地出租"
    },
    {
        "type": 2,
        "kind": 11,
        "name": "土地買賣"
    },
    {
        "type": 1,
        "kind": 12,
        "name": "住辦出租"
    },
    {
        "type": 2,
        "kind": 12,
        "name": "住辦買賣"
    },
    {
        "type": 1,
        "kind": 24,
        "name": "其他"
    }
]
export function getKindList(state: State): FilterOption[] {
    const { type } = state;
    return KIND.filter(k => k.type.toString() === type)
        .map(e => {
            return {
                id: e.kind.toString(),
                key: 'kind',
                name: e.name
            };
        });
}