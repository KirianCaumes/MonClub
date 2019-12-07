import {
    SIGNOUT,
    SET_ERROR,
    SET_URL,
    AUTHENTICATE, 
    MESSAGEBAR
} from "../_action-types"
import request from '../../helper/request'
import { history } from "../../helper/history"

export function setMessageBar(isDisplayed, type = null, message = null) {
    return { type: MESSAGEBAR, payload: { isDisplayed, type, message } }
}

export function setUrl(payload) {
    return { type: SET_URL, payload }
}