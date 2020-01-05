import React from 'react'
import { connect } from "react-redux"
import { Label, TextField, PrimaryButton, Text, MessageBarType, Spinner, SpinnerSize } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { signout } from 'redux/actions/user'
import PublicLayout from './_publicLayout'
import request from 'helper/request'
import { setMessageBar } from 'redux/actions/common'
import { history } from 'helper/history'

class _PasswordNew extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plainPassword: {},
            isLoading: false,
            errorField: [],
        }
    }

    componentDidMount() {
        this.props.signout()
    }

    handleSubmit(ev) {
        ev.preventDefault()

        this.setState({ isLoading: true }, () => {
            request.reset({ plainPassword: this.state.plainPassword, resetToken: this.props.match?.params?.resetToken })
                .then(res => {
                    history.push('/login')
                    this.props.setMessageBar(true, MessageBarType.success, 'Votre mot de passe à bien été modifié.')
                })
                .catch(err => {
                    this.setState({ isLoading: false, errorField: err?.form?.children ? err.form.children : [] })
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
        })
    }

    render() {
        return (
            <PublicLayout>
                <form onSubmit={this.handleSubmit.bind(this)} >
                    <Label htmlFor="first">Nouveau mot de passe</Label>
                    <TextField
                        id="first"
                        placeholder="Votre mot de passe"
                        type="password"
                        value={this.state.plainPassword?.first}
                        onChange={ev => this.setState({ plainPassword: { ...this.state.plainPassword, first: ev.target.value } })}
                        iconProps={{ iconName: 'PasswordField' }}
                        errorMessage={this.state.errorField.plainPassword?.children?.first?.errors?.[0]}
                        readOnly={this.state.isLoading}
                        autoComplete="new-password"
                    />
                    <br />
                    <Label htmlFor="second">Confirmez le mot de passe</Label>
                    <TextField
                        id="second"
                        placeholder="Votre mot de passe"
                        type="password"
                        value={this.state.plainPassword?.second}
                        onChange={ev => this.setState({ plainPassword: { ...this.state.plainPassword, second: ev.target.value } })}
                        iconProps={{ iconName: 'PasswordField' }}
                        errorMessage={this.state.errorField.plainPassword?.children?.first?.errors?.[0]}
                        readOnly={this.state.isLoading}
                        autoComplete="new-password"
                    />
                    <br />
                    <div className="flex-row" >
                        <PrimaryButton
                            iconProps={{ iconName: 'resetToken' }}
                            text="Enregistrer le mot de passe"
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
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {}
}
const PasswordNew = connect(mapStateToProps, mapDispatchToProps)(_PasswordNew)
export default PasswordNew