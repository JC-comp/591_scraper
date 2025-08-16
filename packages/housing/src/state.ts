import type { FilterOption } from './filters/option';

interface State {
    [key: string]: string
}

function hasRecord(options: FilterOption[], state: State): boolean {
    return options.some(option => {
        if (option.key)
            return option.id === state[option.key];
        else if (option.child)
            return hasRecord(option.child, state);
        else
            throw new Error(`Invalid filter option: ${JSON.stringify(option)}`);
    });
}

function updateState(options: FilterOption[], newState: State, state: State) {
    options.forEach(option => {
        if (hasRecord([option], state)) {
            if (option.key)
                newState[option.key] = option.id;
            if (option.child)
                updateState(option.child, newState, state);
        }
    })
}

export {
    hasRecord,
    updateState,
    State
}