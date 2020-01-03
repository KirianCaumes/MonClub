//Component that allow you to navigates from anywhere, even in no react component
//Simply import 'history', and then : history.push({ pathname: '/something', arg1: "Blabla", arg2: "Blabla" })
import store from 'redux/store/index.js'
import { setUrl, setMessageBar } from 'redux/actions/common.js'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()

history.listen((location, action) => {
    store.dispatch(setMessageBar(false))
    store.dispatch(setUrl(location.pathname))
})