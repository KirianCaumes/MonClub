import React from 'react'
import { signout, signin } from "redux/actions/user"
import { connect } from "react-redux"
import { Label, TextField, PrimaryButton, Text, MessageBarType, SpinnerSize, Spinner } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import PublicLayout from './_publicLayout'
import request from 'helper/request'
import { setMessageBar } from 'redux/actions/common'
import { history } from 'helper/history'

class _Login extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            plainPassword: '',
            isLoading: false
        }
    }

    componentDidMount() {
        this.props.signout()
    }

    componentWillUnmount() {
        if (this.fetchAuthenticate) this.fetchAuthenticate.cancel()
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.setState({ isLoading: true }, () => {
            this.fetchAuthenticate = request.authenticate({ username: this.state.username, plainPassword: this.state.plainPassword })
            this.fetchAuthenticate
                .fetch()
                .then(res => {
                    this.props.signin(res.token)
                    this.props.setMessageBar(false)
                    history.push(res.redirectTo ?? '/')
                })
                .catch(err => {
                    this.setState({ isLoading: false })
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
        })
    }
    render() {
        return (
            <PublicLayout>
                <form onSubmit={this.handleSubmit.bind(this)} >
                    <Label htmlFor="username">Email</Label>
                    <TextField
                        id="username"
                        placeholder="Votre email"
                        type="email"
                        value={this.state.username}
                        onChange={ev => this.setState({ username: ev.target.value })}
                        iconProps={{ iconName: 'Mail' }}
                        readOnly={this.state.isLoading}
                        autoComplete="username"
                    />
                    <br />
                    <Label htmlFor="password">Mot de passe</Label>
                    <TextField
                        id="password"
                        placeholder="Votre mot de passe"
                        type="password"
                        value={this.state.plainPassword}
                        onChange={ev => this.setState({ plainPassword: ev.target.value })}
                        iconProps={{ iconName: 'PasswordField' }}
                        readOnly={this.state.isLoading}
                        autoComplete="current-password"
                    />
                    <br />
                    <div className="flex-row" >
                        <PrimaryButton
                            iconProps={{ iconName: 'FollowUser' }}
                            text="Se connecter"
                            type="submit"
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading && <>&nbsp;&nbsp;<Spinner size={SpinnerSize.small} /></>}
                        </PrimaryButton>
                    </div>
                    <br />
                    <Text>
                        Pas encore inscrit ? Créer votre compte <Link to="/inscrire" className="is-underline">ici</Link>
                    </Text>
                    <br />
                    <Text>
                        <Link to="/motdepasse-oublie" className="is-underline">Mot de passe oublié ?</Link>
                    </Text>
                </form>
            </PublicLayout>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        signout: () => dispatch(signout()),
        signin: token => dispatch(signin(token)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {}
}
const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
export default Login