import {
    AUTHENTICATE,
    SET_URL,
    SIGNOUT,
    MESSAGEBAR,
    USER_LOADING,
    SET_USER
} from "../_action-types"

const initialState = {
    isAuthenticated: localStorage.getItem('MONCLUB_token') && localStorage.getItem('MONCLUB_token') !== "null",
    isLoading: false,
    me: {}
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return { ...state, isLoading: action.payload }
        case AUTHENTICATE:
            return { ...state, isAuthenticated: action.payload }
        case SET_USER:
            return { ...state, me: action.payload }
        default:
            break
    }
    return state
}