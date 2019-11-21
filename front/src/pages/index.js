import React from 'react'
import request from '../helper/request'

class Index extends React.Component {
    componentDidMount() {
        request.getContracts().then(x => console.log(x))
    }
    render() {
        return (
            <div>
                Home Sweet Home
            </div>
        )
    }
}

export default Index;
