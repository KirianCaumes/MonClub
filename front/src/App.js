import React from 'react'
import Index from './pages'
import Header from './component/header'
import Login from './pages/login'

class App extends React.Component {
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

export default App
