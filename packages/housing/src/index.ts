import { getCategoryList } from './category';
import { getEndpont } from './filters';
import { hasRecord, updateState } from './state';
import type { State } from './state';
import type { FilterCategory } from './category';
import type { FilterOption } from './filters';

function getOptions(newState: State, state: State): FilterCategory[] {
    const categories = getCategoryList(newState);

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const options = category.getter(newState);
        if (hasRecord(options, newState)) {
            updateState(options, newState, newState);
        } else if (hasRecord(options, state)) {
            updateState(options, newState, state);
        } else {
            let target = options[0];
            while (target.child) {
                target = target.child[0];
                if (target.key)
                    newState[target.key] = target.id;
            }
            if (!target.key)
                throw new Error(`Key not found for target ${JSON.stringify(target)}`);
            newState[target.key] = target.id;
            return getOptions(newState, state);
        }
    }
    return categories;
}

export {
    getEndpont, getOptions,
    FilterOption, State,
    hasRecord
};