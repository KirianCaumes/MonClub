import {
    SIGNOUT,
    SET_ERROR,
    SET_URL,
    AUTHENTICATE, 
    MESSAGEBAR
} from "../_action-types"
import request from '../../helper/request'
import { history } from "../../helper/history"

export function signout() {
    localStorage.removeItem('MONCLUB_token')
    return { type: AUTHENTICATE, payload: false }
}

export function setMessageBar(isDisplayed, type = null, message = null) {
    return { type: MESSAGEBAR, payload: { isDisplayed, type, message } }
}

export function setUrl(payload) {
    return { type: SET_URL, payload }
}

export function authenticate(payload) {
    return function (dispatch) {
        request.authenticate(payload)
            .then(response => {
                localStorage.setItem('MONCLUB_token', response.token)
                dispatch({ type: AUTHENTICATE, payload: true })
                history.push('/')
            })
            .catch(err => {
                console.error(err)
            })
    }
}