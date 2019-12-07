import {
    AUTHENTICATE,
    MESSAGEBAR,
    USER_LOADING,
    ERROR_FIELD,
    SET_USER,
    SET_PARAM,
    IS_INITIALISING
} from "../_action-types"
import request from '../../helper/request'
import { history } from "../../helper/history"
import { MessageBarType } from "office-ui-fabric-react"

export function signout() {
    localStorage.removeItem('MONCLUB_token')
    return { type: AUTHENTICATE, payload: false }
}

export function authenticate(payload) {
    return function (dispatch) {
        dispatch({ type: USER_LOADING, payload: true })
        request.authenticate(payload)
            .then(res => {
                localStorage.setItem('MONCLUB_token', res.token)
                dispatch({ type: AUTHENTICATE, payload: true })
                dispatch({ type: MESSAGEBAR, payload: { isDisplayed: false } })
                history.push('/')
            })
            .catch(err => {
                dispatch({ type: MESSAGEBAR, payload: { isDisplayed: true, type: MessageBarType.error, message: err.message?.toString() || 'Une erreur est survenue.' } })
            })
            .finally(() => {
                dispatch({ type: USER_LOADING, payload: false })
            })
    }
}

export function register(payload) {
    return function (dispatch) {
        dispatch({ type: USER_LOADING, payload: true })
        request.register(payload)
            .then(res => {
                localStorage.setItem('MONCLUB_token', res.token)
                dispatch({ type: AUTHENTICATE, payload: true })
                dispatch({ type: MESSAGEBAR, payload: { isDisplayed: false } })
                history.push('/')
            })
            .catch(err => {
                dispatch({ type: MESSAGEBAR, payload: { isDisplayed: true, type: MessageBarType.error, message: err.message?.toString() || 'Une erreur est survenue.' } })
                if (err?.form?.children) dispatch({ type: ERROR_FIELD, payload: err.form.children })
            })
            .finally(() => {
                dispatch({ type: USER_LOADING, payload: false })
            })
    }
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