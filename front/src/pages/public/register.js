import React from 'react'
import { signout, signin } from "../../redux/actions/user"
import { connect } from "react-redux"
import { Label, TextField, PrimaryButton, Text, MessageBarType, Spinner, SpinnerSize } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import PublicLayout from './_publicLayout'
import request from '../../helper/request'
import { history } from '../../helper/history'
import { setMessageBar } from '../../redux/actions/common'

class _Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            plainPassword: '',
            isLoading: false,
            errorField: []
        }
    }

    componentDidMount() {
        this.props.signout()
    }

    handleSubmit(ev) {
        ev.preventDefault()

        this.setState({ isLoading: true }, () => {
            request.register({ username: this.state.username, plainPassword: this.state.plainPassword })
                .then(res => {
                    this.props.signin(res.token)
                    this.props.setMessageBar(false)
                    history.push('/')
                })
                .catch(err => {
                    this.setState({ isLoading: false, errorField: err?.form?.children ? err.form.children : [] })
                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                })
        })
    }

    render() {
        return (
            <PublicLayout>
                <form onSubmit={this.handleSubmit.bind(this)} >
                    <Label>Email</Label>
                    <TextField
                        placeholder="Votre email"
                        type="email"
                        value={this.state.username}
                        onChange={ev => this.setState({ username: ev.target.value })}
                        iconProps={{ iconName: 'Mail' }}
                        errorMessage={this.state.errorField.username?.errors?.[0]}
                        readOnly={this.state.isLoading}
                    />
                    <br />
                    <Label>Mot de passe</Label>
                    <TextField
                        placeholder="Votre mot de passe"
                        type="password"
                        value={this.state.plainPassword.first}
                        onChange={ev => this.setState({ plainPassword: { ...this.state.plainPassword, first: ev.target.value } })}
                        iconProps={{ iconName: 'PasswordField' }}
                        errorMessage={this.state.errorField.plainPassword?.children?.first?.errors?.[0]}
                        readOnly={this.state.isLoading}
                    />
                    <br />
                    <Label>Confirmez le mot de passe</Label>
                    <TextField
                        placeholder="Votre mot de passe"
                        type="password"
                        value={this.state.plainPassword.second}
                        onChange={ev => this.setState({ plainPassword: { ...this.state.plainPassword, second: ev.target.value } })}
                        iconProps={{ iconName: 'PasswordField' }}
                        errorMessage={this.state.errorField.plainPassword?.children?.first?.errors?.[0]}
                        readOnly={this.state.isLoading}
                    />
                    <br />
                    <div className="flex-row" >
                        <PrimaryButton
                            iconProps={{ iconName: 'FollowUser' }}
                            text="Créer le compte"
                            type="submit"
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading && <>&nbsp;&nbsp;<Spinner size={SpinnerSize.small} /></>}
                        </PrimaryButton>
                    </div>
                    <br />
                    <Text>
                        Retour à la <Link to="/login" className="is-underline">page de connexion</Link>
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
    return {
        isLoading: state.user.isLoading
    }
}
const Register = connect(mapStateToProps, mapDispatchToProps)(_Register)
export default Register