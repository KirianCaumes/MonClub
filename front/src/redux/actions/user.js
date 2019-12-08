import {
    AUTHENTICATE,
    MESSAGEBAR,
    SET_USER,
    SET_PARAM,
    IS_INITIALISING
} from "../_action-types"
import request from '../../helper/request'
import { MessageBarType } from "office-ui-fabric-react"

export function signout() {
    localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_KEY)
    return { type: AUTHENTICATE, payload: false }
}

export function signin(token) {
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_KEY, token)
    return { type: AUTHENTICATE, payload: true }
}

export function init() {
    return function (dispatch) {
        dispatch({ type: IS_INITIALISING, payload: true })
        Promise.all([request.getMe(), request.getParam()])
            .then(([me, param]) => {
                dispatch({ type: SET_USER, payload: me })
                dispatch({ type: SET_PARAM, payload: param })
            })
            .catch(err => {
                dispatch({ type: MESSAGEBAR, payload: { isDisplayed: true, type: MessageBarType.error, message: err.message?.toString() || 'Une erreur est survenue.' } })
            })
            .finally(() => {
                dispatch({ type: IS_INITIALISING, payload: false })
            })
    }
}