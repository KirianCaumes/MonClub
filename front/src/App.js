import React from 'react'
import Index from './pages'
import Header from './component/header'

class App extends React.Component {
    render() {
        return (
            <>
            <Header />
                <Index />
            </>
        )
    }
}

export default App;
