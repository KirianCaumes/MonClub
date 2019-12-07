import {
    SET_URL,
    MESSAGEBAR,
    SET_BREADCRUMB,
    SET_COMMAND
} from "../_action-types"

export function setMessageBar(isDisplayed, type = null, message = null) {
    return { type: MESSAGEBAR, payload: { isDisplayed, type, message } }
}

export function setUrl(payload) {
    return { type: SET_URL, payload }
}

export function setBreadcrumb(payload) {
    return { type: SET_BREADCRUMB, payload }
}

export function setCommand(payload) {
    return { type: SET_COMMAND, payload }
}
