import {
    AUTHENTICATE, INIT,
} from "redux/_action-types"

const initialState = {
    isAuthenticated: !!localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY),
    me: {},
    param: {}
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case AUTHENTICATE:
            return { ...state, isAuthenticated: action.payload }
        case INIT:
            return { ...state, me: action.payload?.me, param: action.payload?.param }
        default:
            break
    }
    return state
}