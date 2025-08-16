export interface FilterOption {
    id: string,
    key: string,
    name: string,
    lat?: string,
    lng?: string,
    child?: FilterOption[]
    parent?: FilterOption
}
