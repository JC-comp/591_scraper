import type { State } from '@/state';
import type { FilterOption } from './option';
import { getSectionList } from "./section";
import { getMetroList } from "./metro_station";
import { getSchoolList } from "./school";
import { getCircleList } from "./circles";

export function getLocationList(state: State): FilterOption[] {
    return [
        {
            id: "",
            key: "",
            name: "依鄉鎮",
            child: getSectionList(state)
        },
        {
            id: "",
            key: "",
            name: "依捷運",
            child: getMetroList(state)
        },
        {
            id: "",
            key: "",
            name: "依學校",
            child: getSchoolList(state)
        },
        {
            id: "",
            key: "",
            name: "依商圈",
            child: getCircleList(state)
        }
    ]
}