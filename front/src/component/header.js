import React from 'react'
import { Navbar } from 'react-bulma-components'

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
                    <Navbar.Item renderAs="a" href="#">
                        <img src={require('../asset/img/logo.png')} alt="THBC" />
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
                    <Navbar.Container position="end">
                        <Navbar.Item href="#">
                            At the end
                        </Navbar.Item>
                    </Navbar.Container>
                </Navbar.Menu>
            </Navbar>
        )
    }
}

export default Header;
