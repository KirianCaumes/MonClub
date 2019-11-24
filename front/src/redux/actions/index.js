import {
    TEST,
    SIGNOUT,
    SET_ERROR,
    SET_URL,
    AUTHENTICATE
} from "../_action-types"
import request from '../../helper/request'

export function something(payload) {
    return { type: TEST, payload }
}

export function signout(cb) {
    setTimeout(cb, 100);
    return { type: SIGNOUT, payload: false }
}

export function setError(payload) {
    return { type: SET_ERROR, payload }
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
            })
            .catch(err => {
                console.error(err)
            })
    }
}