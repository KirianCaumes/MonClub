import {
    SET_URL,
    MESSAGEBAR,
    IS_LOADING,
    SET_BREADCRUMB,
    SET_COMMAND,
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
    breadcrumb: [],
    command: []
}

export default function commonReducer(state = initialState, action) {
    switch (action.type) {
        case SET_URL:
            return { ...state, selectedKeyURL: action.payload }
        case MESSAGEBAR:
            return { ...state, messageBar: action.payload }
        case IS_LOADING:
            return { ...state, isLoading: action.payload }
        case SET_BREADCRUMB:
            return { ...state, breadcrumb: action.payload }
        case SET_COMMAND:
            return { ...state, command: action.payload }
        default:
            break
    }
    return state
}