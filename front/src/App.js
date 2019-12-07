import React from 'react'
import Index from './pages'
import Header from './component/header'
import Login from './pages/login'
import { initializeIcons } from '@uifabric/icons'
import { connect } from "react-redux"
import Layout from './pages/_layout'
import { loadTheme, MessageBar, MessageBarType } from 'office-ui-fabric-react'
import { Switch, Route, Router } from 'react-router-dom'
import { PrivateRoute } from './component/privateRoute'
import { history } from './helper/history'
import Register from './pages/register'
import withLoading from './helper/withLoading'
import { getMe } from './redux/actions/user'
loadTheme({
    palette: {
        themePrimary: '#2b6ca3',
        themeLighterAlt: '#f4f8fb',
        themeLighter: '#d4e3f0',
        themeLight: '#b1cce3',
        themeTertiary: '#6f9ec8',
        themeSecondary: '#3d79ae',
        themeDarkAlt: '#266093',
        themeDark: '#20517c',
        themeDarker: '#183c5b',
        neutralLighterAlt: '#f8f8f8',
        neutralLighter: '#f4f4f4',
        neutralLight: '#eaeaea',
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#bab8b7',
        neutralSecondary: '#a3a2a0',
        neutralPrimaryAlt: '#8d8b8a',
        neutralPrimary: '#323130',
        neutralDark: '#605e5d',
        black: '#494847',
        white: '#ffffff',
    }
});
initializeIcons()

class _App extends React.Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.props.getMe()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && this.props.isAuthenticated !== prevProps.isAuthenticated) {
            this.props.getMe()
        }
    }

    render() {
        const { isAuthenticated, isLoading } = this.props
        return (
            <>
                <Router history={history} >
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                    </Switch>
                    <Switch>
                        <PrivateRoute exact path="/" component={withLoading(isLoading, Index)} isAuthenticated={isAuthenticated} />
                        <PrivateRoute exact path="/membre/nouveau" component={Index} isAuthenticated={isAuthenticated} />
                        <PrivateRoute exact path="/membres" component={Index} isAuthenticated={isAuthenticated} />
                        <PrivateRoute exact path="/membres/moi" component={Index} isAuthenticated={isAuthenticated} />
                    </Switch>
                </Router>
            </>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        getMe: () => dispatch(getMe())
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        isLoading: state.common.isLoading
    }
}
const App = connect(mapStateToProps, mapDispatchToProps)(_App)

export default App
