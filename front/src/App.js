import React from 'react'
import Index from './pages'
import Login from './pages/public/login'
import { initializeIcons } from '@uifabric/icons'
import { connect } from "react-redux"
import Layout from './pages/_layout'
import { loadTheme, MessageBarType } from 'office-ui-fabric-react'
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
import { setMessageBar } from './redux/actions/common'
import MembersAll from './pages/member/all'
import MemberOne from './pages/member/one'
import MembersMe from './pages/member/me'
import Constants from './pages/admin/constants'
import TeamsAll from './pages/team/all'
import TeamOne from './pages/team/one'
import UsersAll from './pages/user/all'
import UserOne from './pages/user/one'
import Modal from './component/modal'
import { registerIcons } from '@uifabric/styling'

//Add icons from fontawesome to Ms
registerIcons({
    icons: {
        'Man': '',
        'Woman': '',
    }
})

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
    constructor(props) {
        super(props)
        this.state = {
            isInit: false
        }
    }

    componentDidCatch(error, info) {
        request.postLog({
            env: process.env.NODE_ENV,
            datetime: new Date(),
            error: error.message,
            info: 'INFO: ' + JSON.stringify(info) + ' STACK: ' + (JSON.stringify(error?.stack) ?? error)
        }).then()
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.init()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && this.props.isAuthenticated !== prevProps.isAuthenticated) {
            this.init()
        }
    }

    init() {
        this.setState({ isInit: false }, () => {
            Promise.all([request.getMe(), request.getParam()])
                .then(([me, param]) => {
                    this.props.init(me, param)
                })
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => {
                    this.setState({ isInit: true })
                })
        })
    }

    render() {
        const { isAuthenticated } = this.props
        const { isInit } = this.state
        return (
            <>
                {false && <FullLoader isLoading={!isInit && isAuthenticated} />}
                <Router history={history} >
                    <Layout
                        isDisplay={isAuthenticated}
                        refresh={() => this.init()}
                    >
                        <Switch>
                            <PrivateRoute exact path="/" component={withData(Index, () => request.getInfos())} isAuthenticated={isAuthenticated} isInit={isInit} />

                            <PrivateRoute exact path="/membres" component={MembersAll} isAuthenticated={isAuthenticated} isInit={isInit} />
                            <PrivateRoute path="/membres/moi" component={withData(MembersMe, () => request.getMeMember())} isAuthenticated={isAuthenticated} isInit={isInit} />
                            <PrivateRoute path="/membre/nouveau" component={withData(MemberOne, () => request.getNewMember())} isAuthenticated={isAuthenticated} isInit={isInit} />
                            <PrivateRoute path="/membre/:id" component={withData(MemberOne, (props) => request.getOneMember(props?.id))} isAuthenticated={isAuthenticated} isInit={isInit} />

                            <PrivateRoute exact path="/utilisateurs" component={UsersAll} isAuthenticated={isAuthenticated} isInit={isInit} />
                            <PrivateRoute path="/utilisateur/:id" component={withData(UserOne, (props) => request.getOneUser(props?.id))} isAuthenticated={isAuthenticated} isInit={isInit} />

                            <PrivateRoute exact path="/equipes" component={TeamsAll} isAuthenticated={isAuthenticated} isInit={isInit} />
                            <PrivateRoute path="/equipe/nouveau" component={withData(TeamOne, () => request.getNewTeam())} isAuthenticated={isAuthenticated} isInit={isInit} />
                            <PrivateRoute path="/equipe/:id" component={withData(TeamOne, (props) => request.getOneTeam(props?.id))} isAuthenticated={isAuthenticated} isInit={isInit} />

                            <PrivateRoute path="/constantes" component={Constants} isAuthenticated={isAuthenticated} isInit={isInit} />
                        </Switch>
                    </Layout>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/motdepasse-oublie/:resetToken" component={PasswordNew} />
                        <Route path="/motdepasse-oublie" component={PasswordForgotten} />
                    </Switch>
                </Router>
                <Modal />
            </>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        init: (me, param) => dispatch(init(me, param)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated
    }
}
const App = connect(mapStateToProps, mapDispatchToProps)(_App)

export default App
