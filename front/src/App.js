import React from 'react'
import Index from './pages'
import Header from './component/header'
import Login from './pages/login'

import { connect } from "react-redux"

class _App extends React.Component {
    componentDidMount() {
        console.log(this.props.isAuthenticated)
    }
    render() {
        return (
            <>
            <Header />
                {/* <Index /> */}
                <Login />
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
