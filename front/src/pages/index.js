import React from 'react'
import request from '../helper/request'
import { Nav, CommandBar, CommandBarBase } from 'office-ui-fabric-react';
import Header from '../component/header';

class Index extends React.Component {
    componentDidMount() {
        request.getContracts().then(x => console.log(x))
    }
    render() {
        return (
            <>
                JE SUIS DU CONTENU
            </>
        )
    }
}

export default Index;
