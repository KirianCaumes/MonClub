import {
    AUTHENTICATE,
    SET_URL,
    SIGNOUT,
    MESSAGEBAR
} from "../_action-types"

const initialState = {
    isAuthenticated: localStorage.getItem('MONCLUB_token') && localStorage.getItem('MONCLUB_token') !== "null",
    selectedKeyURL: '/',
    messageBar: {
        isDisplayed: false,
        type: null,
        message: null
    }
}

export default function commonReducer(state = initialState, action) {
    switch (action.type) {
        case AUTHENTICATE:
            return { ...state, isAuthenticated: action.payload }
        case SET_URL:
            return { ...state, selectedKeyURL: action.payload }
        case MESSAGEBAR:
            return { ...state, messageBar: action.payload }
        default:
            break
    }
    return state
}