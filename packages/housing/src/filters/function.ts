import type { FilterOption } from './option';

export function getFilterAllOption(key: string): FilterOption[] {
    return [{
        id: "",
        key: key,
        name: "不限"
    }]
}