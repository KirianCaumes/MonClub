import React from 'react'
import { Navbar } from 'react-bulma-components'
import { Icon } from 'office-ui-fabric-react'
import { history } from '../../helper/history'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false
        }
    }

    render() {
        return (
            <Navbar
                active={this.state.active}
                transparent={false}
                className="has-background-dark-blue"
            >
                <Navbar.Brand>
                    <Navbar.Item 
                        renderAs="a" 
                        onClick={() => history.push('/')}
                    >
                        <img src={require('../../asset/img/logo.png')} alt="THBC" />
                        <span> Mon Club</span>                   
                    </Navbar.Item>
                    <Navbar.Burger onClick={() => this.setState({ active: !this.state.active })} />
                </Navbar.Brand>
                <Navbar.Menu >
                    <Navbar.Container className="is-hidden-desktop">
                        <Navbar.Item dropdown hoverable href="#">
                            <Navbar.Link arrowless={false}>
                                First
                            </Navbar.Link>
                            <Navbar.Dropdown>
                                <Navbar.Item href="#">
                                    Subitem 1
                                </Navbar.Item>
                                <Navbar.Item href="#">
                                    Subitem 2
                                </Navbar.Item>
                            </Navbar.Dropdown>
                        </Navbar.Item>
                        <Navbar.Item href="#">
                            Second
                        </Navbar.Item>
                    </Navbar.Container>
                    <Navbar.Container position="end" className="is-hidden-touch">
                        <Navbar.Item
                            className="is-tab"
                            onClick={() => history.push('/utilisateur')}
                        >
                            <Icon iconName='Contact' />
                        </Navbar.Item>
                        <Navbar.Item
                            className="is-tab"
                            onClick={() => history.push('/login')}
                        >
                            <Icon iconName='ReleaseGate' />
                        </Navbar.Item>
                    </Navbar.Container>
                </Navbar.Menu>
            </Navbar>
        )
    }
}

export default Header;
