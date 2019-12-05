import React from 'react'
import Index from './pages'
import Header from './component/header'
import Login from './pages/login'
import { initializeIcons } from '@uifabric/icons'
import { connect } from "react-redux"
import Layout from './pages/_layout'
import { loadTheme } from 'office-ui-fabric-react';

loadTheme({
    palette: {
        themePrimary: '#0f3375',
        themeLighterAlt: '#f1f4f9',
        themeLighter: '#c9d4e9',
        themeLight: '#9eb1d6',
        themeTertiary: '#5272ac',
        themeSecondary: '#1f4386',
        themeDarkAlt: '#0e2e6a',
        themeDark: '#0c2759',
        themeDarker: '#091d42',
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
        console.log(this.props.isAuthenticated)
    }
    render() {
        return (
            <>
                <Layout>
                    <Index />
                    {/* <Login /> */}
                </Layout>
            </>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.common.isAuthenticated
    }
}
const App = connect(mapStateToProps, mapDispatchToProps)(_App)

export default App
