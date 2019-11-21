import { } from "../_action-types"
import { } from '../actions/index'

export function forbiddenWordsMiddleware({ dispatch }) {
    return function (next) {
        return function (action) {
            switch (action.type) {
                case null:
                    // return dispatch(something(FOUND_BAD_WORD))
                    break
                default:
                    break
            }
            return next(action)
        }
    }
}