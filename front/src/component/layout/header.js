import React from 'react'
import { Navbar } from 'react-bulma-components'
import { Icon, Panel, Label, TextField } from 'office-ui-fabric-react'
import { history } from 'helper/history'
import { dateToCleanDateTimeString } from 'helper/date'

class Header extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            isOpenUser: false
        }
    }

    render() {
        const { menu, me } = this.props

        return (
            <>
                <Navbar
                    active={this.state.active}
                    transparent={false}
                >
                    <Navbar.Brand>
                        <Navbar.Item
                            renderAs="a"
                            onClick={() => history.push('/')}
                        >
                            <img src={require('asset/img/logo.png')} alt="THBC" />
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
                                                    <React.Fragment key={i + "_" + j} >
                                                        <Navbar.Item onClick={() => this.setState({ active: false }, () => y.onClick())}>
                                                            {y.name}
                                                        </Navbar.Item>
                                                        {
                                                            y?.links?.length &&
                                                            y?.links.map((z, k) => (
                                                                <Navbar.Item key={i + "_" + j + "_" + k} onClick={() => this.setState({ active: false }, () => z.onClick())}>
                                                                    {z.name}
                                                                </Navbar.Item>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                )
                                                )
                                            }
                                        </Navbar.Dropdown>
                                    </Navbar.Item>
                                ))
                            }
                            <Navbar.Item dropdown>
                                <Navbar.Dropdown>
                                    <Navbar.Item
                                        onClick={() => this.setState({ active: false }, () => this.props.refresh())}
                                    >
                                        <Icon iconName='Refresh' /> Rafraichir
                                    </Navbar.Item>
                                    <Navbar.Item
                                        onClick={() => this.setState({ isOpenUser: true })}
                                    >
                                        <Icon iconName='Contact' /> Utilisateur
                                    </Navbar.Item>
                                    <Navbar.Item
                                        onClick={() => history.push('/login')}
                                    >
                                        <Icon iconName='ReleaseGate' /> Se déconnecter
                                    </Navbar.Item>
                                </Navbar.Dropdown>
                            </Navbar.Item>
                        </Navbar.Container>
                        <Navbar.Container position="end" className="is-hidden-touch">
                            <Navbar.Item
                                className="is-tab"
                                onClick={() => this.props.refresh()}
                            >
                                <Icon iconName='Refresh' />
                            </Navbar.Item>
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
                    <Label htmlFor="username">Nom</Label>
                    <TextField
                        id="username"
                        value={me?.username ?? ''}
                        borderless={true}
                        readOnly={true}
                    />
                    <br />
                    <Label htmlFor="roles">Roles</Label>
                    <TextField
                        id="roles"
                        defaultValue={me?.roles?.length ? me?.roles?.join(', ') : 'Utilisateur'}
                        borderless={true}
                        readOnly={true}
                    />
                    <br />
                    <Label htmlFor="parent_twcreation_datetimeo_profession">Date de création</Label>
                    <TextField
                        id="creation_datetime"
                        value={dateToCleanDateTimeString(new Date(me?.creation_datetime))}
                        borderless={true}
                        readOnly={true}
                    />
                    <br />
                    <Label htmlFor="last_login">Dernière connexion</Label>
                    <TextField
                        id="last_login"
                        value={dateToCleanDateTimeString(new Date(me?.last_login))}
                        borderless={true}
                        readOnly={true}
                    />
                </Panel>
            </>
        )
    }
}

export default Header