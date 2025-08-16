import type { State } from '@/state';

const ENDPOINT = {
    businessList: "https://bff-business.591.com.tw/v2/web/business/list",
    rentList: "https://bff-house.591.com.tw/v3/web/rent/list"
}

export function getEndpont(state: State): string {
    const { kind } = state;
    if (![1, 2, 3, 4].map(e => e.toString()).includes(kind))
        return ENDPOINT.businessList;
    return ENDPOINT.rentList;
}