import React from 'react'
import { Columns } from 'react-bulma-components'
import { connect } from "react-redux"
import '../style/page/login.scss'
import { Label, TextField, PrimaryButton, Text, MessageBar } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { setMessageBar } from '../redux/actions/common'
import { resetMail } from '../redux/actions/user'

class _PasswordForgotten extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: ''
        }
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.props.resetMail({ username: this.state.username })
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
                                    <div className="flex-row" >
                                        <PrimaryButton
                                            iconProps={{ iconName: 'MailForward' }}
                                            text="Réinitialiser le mot de passe"
                                            type="submit"
                                            disabled={this.props.isLoading}
                                        />
                                        {/* {this.props.isLoading && <Spinner size={SpinnerSize.medium} />} */}
                                    </div>
                                    <br />
                                    <Text>
                                        Retour à la <Link to="/login" className="is-underline">page de connexion</Link>
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
        resetMail: data => dispatch(resetMail(data)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.user.isLoading,
        messageBar: state.common.messageBar,
        errorField: state.common.errorField
    }
}
const PasswordForgotten = connect(mapStateToProps, mapDispatchToProps)(_PasswordForgotten)
export default PasswordForgotten