import React from 'react'
import { connect } from "react-redux"
import { Label, TextField, PrimaryButton, Text, MessageBarType, Spinner, SpinnerSize } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { signout } from 'redux/actions/user'
import PublicLayout from './_publicLayout'
import request from 'helper/request'
import { history } from 'helper/history'
import { setMessageBar } from 'redux/actions/common'

class _PasswordForgotten extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            isLoading: false
        }
    }

    componentDidMount() {
        this.props.signout()
    }

    componentWillUnmount() {
        if (this.fetchResetMail) this.fetchResetMail.cancel()
    }

    handleSubmit(ev) {
        ev.preventDefault()

        this.setState({ isLoading: true }, () => {
            this.fetchResetMail = request.resetMail({ username: this.state.username })
            this.fetchResetMail
                .fetch()
                .then(res => {
                    history.push('/login')
                    this.props.setMessageBar(true, MessageBarType.success, 'Un email vient de vous être envoyé.')
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
                    <div className="flex-row" >
                        <PrimaryButton
                            iconProps={{ iconName: 'MailForward' }}
                            text="Réinitialiser le mot de passe"
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
const PasswordForgotten = connect(mapStateToProps, mapDispatchToProps)(_PasswordForgotten)
export default PasswordForgotten