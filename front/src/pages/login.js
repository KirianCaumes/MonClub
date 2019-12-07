import React from 'react'
import { Columns } from 'react-bulma-components'
import { authenticate, signout } from "../redux/actions/user"
import { connect } from "react-redux"
import '../style/page/login.scss'
import { Label, TextField, PrimaryButton, Text, MessageBar } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { setMessageBar } from '../redux/actions/common'

class _Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            plainPassword: ''
        }
    }

    componentDidMount() {
        this.props.signout()
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.props.authenticate({ username: this.state.username, plainPassword: this.state.plainPassword })
    }
    render() {
        return (
            <section id="login">
                <Columns>
                    <Columns.Column className="is-hidden-touch" />

                    <Columns.Column>
                        <div className="flex-col">
                            <div className="card">
                                <img src={require('../asset/img/logo.png')} alt="THBC" />
                                <br />
                                <Text variant="xxLarge" block>
                                    Mon Club - thouarehbc.fr
                                </Text>
                                <br />

                                {
                                    this.props.messageBar && this.props.messageBar.isDisplayed &&
                                    <>
                                        <MessageBar messageBarType={this.props.messageBar.type} isMultiline={false} onDismiss={() => this.props.setMessageBar(false)}>
                                            {this.props.messageBar.message}
                                        </MessageBar>
                                        <br />
                                    </>
                                }

                                <form onSubmit={this.handleSubmit.bind(this)} >
                                    <Label>Email</Label>
                                    <TextField
                                        placeholder="Votre email"
                                        type="email"
                                        value={this.state.username}
                                        onChange={ev => this.setState({ username: ev.target.value })}
                                        iconProps={{ iconName: 'Mail' }}
                                    />
                                    <br />
                                    <Label>Mot de passe</Label>
                                    <TextField
                                        placeholder="Votre mot de passe"
                                        type="password"
                                        value={this.state.plainPassword}
                                        onChange={ev => this.setState({ plainPassword: ev.target.value })}
                                        iconProps={{ iconName: 'PasswordField' }}
                                    />
                                    <br />
                                    <div className="flex-row" >
                                        <PrimaryButton
                                            iconProps={{ iconName: 'FollowUser' }}
                                            text="Se connecter"
                                            type="submit"
                                            disabled={this.props.isLoading}
                                        />
                                        {/* {this.props.isLoading && <Spinner size={SpinnerSize.medium} />} */}
                                    </div>
                                    <br />
                                    <Text>
                                        Pas encors inscris ? Créer votre compte <Link to="/register" className="is-underline">ici</Link>
                                    </Text>
                                </form>

                            </div>
                        </div>
                    </Columns.Column>
                    <Columns.Column className="is-hidden-touch" />
                </Columns>
            </section>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        authenticate: data => dispatch(authenticate(data)),
        signout: () => dispatch(signout()),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.user.isLoading,
        messageBar: state.common.messageBar
    }
}
const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
export default Login