import React from 'react'
import { Navbar } from 'react-bulma-components'

class Header extends React.Component {
    render() {
        return (
            <Navbar
                color="white"
                fixed='top'
                active={false}
                transparent={false}
            >
                <Navbar.Brand>
                    <Navbar.Item renderAs="a" href="#">
                        <img src={require('../asset/img/logo.png')} alt="THBC" />
                    </Navbar.Item>
                    <Navbar.Burger />
                </Navbar.Brand>
                <Navbar.Menu >
                    <Navbar.Container>
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
