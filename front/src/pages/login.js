import React from 'react'
import { Button, Form, Columns } from 'react-bulma-components'

import { authenticate, signout } from "../redux/actions"
import { connect } from "react-redux"

import '../style/page/login.scss'
import { Label, TextField, PrimaryButton } from 'office-ui-fabric-react'

class _Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            plainPassword: ''
        }
    }

    componentDidMount() {
        // request.getContracts().then(x => console.log(x))
        this.props.signout()
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.props.authenticate({ username: this.state.email, plainPassword: this.state.plainPassword })
        // request.authenticate({username : this.state.email, password: this.state.password})
        //     .then(data => {
        //         console.log(data)
        //     })
        // console.log(this.state)
    }
    render() {
        return (
            <section className="login">
                <Columns>
                    <Columns.Column></Columns.Column>
                    <Columns.Column>

                        <form onSubmit={this.handleSubmit.bind(this)} >
                            <Label>Email</Label>
                            <TextField
                                placeholder="Votre email"
                                type="email"
                                value={this.state.email}
                                onChange={ev => this.setState({ email: ev.target.value })}
                                iconProps={{ iconName: 'Mail' }}
                            />
                            <br/>
                            <Label>Mot de passe</Label>
                            <TextField
                                placeholder="Votre mot de passe"
                                type="password"
                                value={this.state.plainPassword}
                                onChange={ev => this.setState({ plainPassword: ev.target.value })}
                                iconProps={{ iconName: 'PasswordField' }}
                            />
                            <br/>
                            <PrimaryButton 
                                text="Se connecter" 
                                type="submit"
                            />
                        </form>

                    </Columns.Column>
                    <Columns.Column></Columns.Column>
                </Columns>
            </section>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        authenticate: isAuthenticated => dispatch(authenticate(isAuthenticated)),
        signout: () => dispatch(signout())
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.common.isAuthenticated
    }
}
const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
export default Login