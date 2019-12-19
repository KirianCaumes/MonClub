import React from 'react'
import { Navbar } from 'react-bulma-components'
import { Icon, Panel, Label, TextField } from 'office-ui-fabric-react'
import { history } from '../../helper/history'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            isOpenUser: false
        }
    }

    render() {
        const { menu } = this.props

        return (
            <>
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
                            {
                                menu.map((x, i) => (
                                    <Navbar.Item dropdown key={i}>
                                        {
                                            x.name &&
                                            <Navbar.Link arrowless={true}>
                                                {x.name}
                                            </Navbar.Link>
                                        }
                                        <Navbar.Dropdown>
                                            {
                                                x?.links.map((y, j) => (
                                                    <Navbar.Item key={i + "_" + j} onClick={() => this.setState({ active: false }, () => y.onClick())}>
                                                        {y.name}
                                                    </Navbar.Item>
                                                ))
                                            }
                                        </Navbar.Dropdown>
                                    </Navbar.Item>
                                ))
                            }
                        </Navbar.Container>
                        <Navbar.Container position="end" className="is-hidden-touch">
                            <Navbar.Item
                                className="is-tab"
                                onClick={() => this.setState({ isOpenUser: true })}
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
                <Panel
                    headerText="Votre compte"
                    isLightDismiss={true}
                    isOpen={this.state.isOpenUser}
                    onDismiss={() => this.setState({ isOpenUser: false })}
                    closeButtonAriaLabel="Close"
                >
                    <br />
                    <Label>Nom</Label>
                    <TextField
                        value={this.props?.me?.username ?? ''}
                        borderless={true}
                        readOnly={true}
                    />
                    <br />
                    <Label>Roles</Label>
                    <TextField
                        defaultValue={this.props?.me?.roles?.length ? this.props?.me?.roles?.join(', ') : 'Utilisateur'}
                        borderless={true}
                        readOnly={true}
                    />
                    <br />
                    <Label>Date de création</Label>
                    <TextField
                        value={this.props?.me?.creation_datetime ? (new Date(this.props?.me?.creation_datetime)).toLocaleString('fr-FR') : ''}
                        borderless={true}
                        readOnly={true}
                    />
                    <br />
                    <Label>Dernière connexion</Label>
                    <TextField
                        value={this.props?.me?.last_login ? (new Date(this.props?.me?.last_login)).toLocaleString('fr-FR') : ''}
                        borderless={true}
                        readOnly={true}
                    />
                </Panel>
            </>
        )
    }
}

export default Header