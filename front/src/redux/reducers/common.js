import React from 'react'
import {
    SET_URL,
    SET_MESSAGEBAR,
    IS_LOADING,
    SET_BREADCRUMB,
    SET_COMMAND,
    SET_MODAL
} from "redux/_action-types"

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
    command: [],
    modal: {
        show: false,
        title: '',
        subTitle: '',
        callback: () => null,
        content: <></>
    }
}

export default function commonReducer(state = initialState, action) {
    switch (action.type) {
        case SET_URL:
            return { ...state, selectedKeyURL: action.payload }
        case SET_MESSAGEBAR:
            return { ...state, messageBar: action.payload }
        case IS_LOADING:
            return { ...state, isLoading: action.payload }
        case SET_BREADCRUMB:
            return { ...state, breadcrumb: action.payload }
        case SET_COMMAND:
            return { ...state, command: action.payload }
        case SET_MODAL:
            return { ...state, modal: action.payload }
        default:
            break
    }
    return state
}