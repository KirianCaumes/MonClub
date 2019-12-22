import { combineReducers } from "redux"
import commonReducer from './common'
import userReducer from './user'
import memberReducer from './member'

export default combineReducers({
    common: commonReducer,
    user: userReducer,
    member: memberReducer
})
