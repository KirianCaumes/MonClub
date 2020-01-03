import {
    SET_URL,
    SET_MESSAGEBAR,
    SET_BREADCRUMB,
    SET_COMMAND,
    IS_LOADING,
    SET_MODAL,
} from "redux/_action-types"

import { MessageBarType } from "office-ui-fabric-react"

export function setMessageBar(isDisplayed, type = null, message = null) {
    switch (type) {
        case MessageBarType.error:
            if (message?.error?.code === 403) type = MessageBarType.blocked
            message = message.message ?? message.error?.exception?.[0]?.message ?? message.error?.message ?? 'Une erreur est survenue.'
            break
        case MessageBarType.success:
            message = message ? message : "L'opération s'est correctement déroulée."
            break
        default:
            break
    }
    return { type: SET_MESSAGEBAR, payload: { isDisplayed, type, message } }
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

export function setLoading(payload) {
    return { type: IS_LOADING, payload }
}

export function setModal(show = false, title = '', subTitle = '', callback = () => null) {
    return { type: SET_MODAL, payload: { show, title, subTitle, callback } }
}