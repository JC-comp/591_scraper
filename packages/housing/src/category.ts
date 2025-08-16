import type { State } from '@/state';
import type { FilterOption } from './filters';
import { getKindList, getRegionList, getTypeList, getLocationList } from './filters';

interface FilterCategory {
    name: string,
    getter: (state: State) => FilterOption[]
}

function getCategoryList(state: State): FilterCategory[] {
    const categories = [
        {
            name: "種類",
            getter: getTypeList
        },
        {
            name: "類別",
            getter: getKindList
        },
        {
            name: "地區",
            getter: getRegionList
        },
        {
            name: "位置",
            getter: getLocationList
        }
    ];

    return categories;
}

export {
    FilterCategory,
    getCategoryList
}