import { combineReducers } from "redux"
import commonReducer from './common'
import contractReducer from './contract'

export default combineReducers({
    common: commonReducer,
    contract: contractReducer,
})
