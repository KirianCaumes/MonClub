import {
    SET_URL,
    MESSAGEBAR
} from "../_action-types"

export function setMessageBar(isDisplayed, type = null, message = null) {
    return { type: MESSAGEBAR, payload: { isDisplayed, type, message } }
}

export function setUrl(payload) {
    return { type: SET_URL, payload }
}
