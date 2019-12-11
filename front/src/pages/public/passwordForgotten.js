import React from 'react'
import { connect } from "react-redux"
import { Label, TextField, PrimaryButton, Text, MessageBarType } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { signout } from '../../redux/actions/user'
import PublicLayout from './_publicLayout'
import request from '../../helper/request'
import { history } from '../../helper/history'
import { setMessageBar } from '../../redux/actions/common'

class _PasswordForgotten extends React.Component {
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

    handleSubmit(ev) {
        ev.preventDefault()

        this.setState({ isLoading: true }, () => {
            request.resetMail({ username: this.state.username })
                .then(res => {
                    this.props.setMessageBar(true, MessageBarType.success, 'Un email vient de vous être envoyé.')
                    history.push('/login')
                })
                .catch(err => {
                    this.setState({ isLoading: false })
                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error.message)
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
                    />
                    <br />
                    <div className="flex-row" >
                        <PrimaryButton
                            iconProps={{ iconName: 'MailForward' }}
                            text="Réinitialiser le mot de passe"
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
const PasswordForgotten = connect(mapStateToProps, mapDispatchToProps)(_PasswordForgotten)
export default PasswordForgotten