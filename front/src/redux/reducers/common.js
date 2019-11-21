import {
    TEST
} from "../_action-types"

const initialState = {
    temp: {}
}

export default function commonReducer(state = initialState, action) {
    switch (action.type) {
        case TEST:
            return { ...state, temp: action.payload }
        default:
            break
    }
    return state
}