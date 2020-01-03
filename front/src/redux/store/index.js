import { createStore, applyMiddleware, compose } from "redux"
import reducer from 'redux/reducers/_index'
import { forbiddenWordsMiddleware } from "redux/middleware/index"
import thunk from "redux-thunk"

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
    reducer,
    storeEnhancers(applyMiddleware(forbiddenWordsMiddleware, thunk))
)

export default store