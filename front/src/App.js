import React from 'react'
import Index from './pages'
import Login from './pages/public/login'
import { initializeIcons } from '@uifabric/icons'
import { connect } from "react-redux"
import Layout from './pages/_layout'
import { loadTheme } from 'office-ui-fabric-react'
import { Switch, Route, Router } from 'react-router-dom'
import { PrivateRoute } from './component/privateRoute'
import { history } from './helper/history'
import Register from './pages/public/register'
import { init } from './redux/actions/user'
import FullLoader from './component/fullLoader'
import PasswordForgotten from './pages/public/passwordForgotten'
import PasswordNew from './pages/public/passwordNew'
import withData from './helper/hoc/withData'
import request from './helper/request'

initializeIcons()
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
})

class _App extends React.Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            // this.props.init()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && this.props.isAuthenticated !== prevProps.isAuthenticated) {
            this.props.init()
        }
    }

    render() {
        const { isAuthenticated, isInitialising } = this.props
        return (
            <>
                <FullLoader isLoading={isInitialising} />
                <Router history={history} >
                    <Layout isDisplay={isAuthenticated}>
                        <Switch>
                            <PrivateRoute exact path="/" component={withData(Index, () => request.getInfos())} isAuthenticated={isAuthenticated} />
                            <PrivateRoute exact path="/membres" component={Index} isAuthenticated={isAuthenticated} />
                            <PrivateRoute exact path="/membres/moi" component={Index} isAuthenticated={isAuthenticated} />
                            <PrivateRoute exact path="/membre/nouveau" component={Index} isAuthenticated={isAuthenticated} />
                            <PrivateRoute exact path="/membre/:id" component={Index} isAuthenticated={isAuthenticated} />
                        </Switch>
                    </Layout>
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/motdepasse-oublie" component={PasswordForgotten} />
                        <Route exact path="/motdepasse-oublie/:resetToken" component={PasswordNew} />
                    </Switch>
                </Router>
            </>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        init: () => dispatch(init())
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        isInitialising: state.user.isInitialising,
        isLoading: state.common.isLoading
    }
}
const App = connect(mapStateToProps, mapDispatchToProps)(_App)

export default App
