import {
    TEST,
    AUTHENTICATE,
    SET_URL
} from "../_action-types"

const initialState = {
    temp: {},
    isAuthenticated: localStorage.getItem('MONCLUB_token') && localStorage.getItem('MONCLUB_token') !== "null",
    selectedKeyURL: '/',
}

export default function commonReducer(state = initialState, action) {
    switch (action.type) {
        case AUTHENTICATE:
            return { ...state, isAuthenticated: () => { return action.payload } }
        case SET_URL:
            return { ...state, selectedKeyURL: action.payload }
        case TEST:
            return { ...state, temp: action.payload }
        default:
            break
    }
    return state
}