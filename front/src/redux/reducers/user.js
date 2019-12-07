import {
    AUTHENTICATE,
    USER_LOADING,
    SET_USER,
    IS_INITIALISING,
    SET_PARAM
} from "../_action-types"

const initialState = {
    isAuthenticated: localStorage.getItem('MONCLUB_token') && localStorage.getItem('MONCLUB_token') !== "null",
    isLoading: false,
    me: {},
    param: {},
    isInitialising: false,
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return { ...state, isLoading: action.payload }
        case AUTHENTICATE:
            return { ...state, isAuthenticated: action.payload }
        case IS_INITIALISING:
            return { ...state, isInitialising: action.payload }
        case SET_USER:
            return { ...state, me: action.payload }
        case SET_PARAM:
            return { ...state, param: action.payload }
        default:
            break
    }
    return state
}