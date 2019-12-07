import React from 'react'
import { Columns } from 'react-bulma-components'
import { connect } from "react-redux"
import '../style/page/login.scss'
import { Label, TextField, PrimaryButton, Text, MessageBar } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { setMessageBar } from '../redux/actions/common'
import { reset } from '../redux/actions/user'

class _PasswordNew extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plainPassword: ''
        }
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.props.reset({ plainPassword: this.state.plainPassword, resetToken: this.props.match?.params?.resetToken })
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
        reset: data => dispatch(reset(data)),
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
const PasswordNew = connect(mapStateToProps, mapDispatchToProps)(_PasswordNew)
export default PasswordNew