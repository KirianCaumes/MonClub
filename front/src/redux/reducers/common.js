import {
    SET_URL,
    MESSAGEBAR,
    ERROR_FIELD,
    IS_LOADING,
} from "../_action-types"

const initialState = {
    selectedKeyURL: '/',
    messageBar: {
        isDisplayed: false,
        type: null,
        message: null
    },
    errorField: [],
    isLoading: false,
}

export default function commonReducer(state = initialState, action) {
    switch (action.type) {
        case SET_URL:
            return { ...state, selectedKeyURL: action.payload }
        case MESSAGEBAR:
            return { ...state, messageBar: action.payload }
        case ERROR_FIELD:
            return { ...state, errorField: action.payload }
        case IS_LOADING:
            return { ...state, isLoading: action.payload }
        default:
            break
    }
    return state
}