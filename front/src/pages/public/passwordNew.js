import React from 'react'
import { connect } from "react-redux"
import { Label, TextField, PrimaryButton, Text, MessageBarType } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { signout } from '../../redux/actions/user'
import PublicLayout from './_publicLayout'
import request from '../../helper/request'
import { setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'

class _PasswordNew extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plainPassword: ''
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
                    this.props.setMessageBar(true, MessageBarType.success, 'Votre mot de passe à bien été modifié.')
                    history.push('/login')
                })
                .catch(err => {
                    this.setState({ isLoading: false })
                    this.props.setMessageBar(true, MessageBarType.error, err.message?.toString() || 'Une erreur est survenue.')
                })
        })
    }

    render() {
        return (
            <PublicLayout>
                <form onSubmit={this.handleSubmit.bind(this)} >
                    <Label>Nouveau mot de passe</Label>
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
                            iconProps={{ iconName: 'resetToken' }}
                            text="Enregistrer le mot de passe"
                            type="submit"
                            disabled={this.state.isLoading}
                        />
                        {/* {this.props.isLoading && <Spinner size={SpinnerSize.medium} />} */}
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