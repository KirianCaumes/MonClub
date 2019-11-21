import {
    TEST,
    SIGNOUT,
    SET_ERROR,
    SET_URL
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
