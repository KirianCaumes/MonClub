import {
    AUTHENTICATE,
    INIT
} from "redux/_action-types"

export function signout() {
    localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_KEY)
    return { type: AUTHENTICATE, payload: false }
}

export function signin(token) {
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_KEY, token)
    return { type: AUTHENTICATE, payload: true }
}

export function init(me, param) {
    return { type: INIT, payload: { me, param } }
}