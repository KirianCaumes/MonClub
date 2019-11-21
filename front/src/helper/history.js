//Component that allow you to navigates from anywhere, even in no react component
//Simply import 'history', and then : history.push({ pathname: '/something', arg1: "Blabla", arg2: "Blabla" })
import store from '../redux/store/index.js'
import { setUrl } from '../redux/actions/index.js'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()
history.pages = []

history.listen((location, action) => {
    history.pages.push(location.pathname)
    // console.log(history.data)
    store.dispatch(setUrl(location.pathname))
})