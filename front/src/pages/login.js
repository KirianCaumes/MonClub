import React from 'react'
import { Button, Form, Columns } from 'react-bulma-components'

import { authenticate } from "../redux/actions"
import { connect } from "react-redux"

import '../style/page/login.scss'

class _Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        // request.getContracts().then(x => console.log(x))
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.props.authenticate({username : this.state.email, password: this.state.password})
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
                            <Form.Field>
                                <Form.Label>Email</Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        placeholder="Votre email"
                                        type="email"
                                        value={this.state.email}
                                        onChange={ev => this.setState({ email: ev.target.value })}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field>
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        placeholder="Votre mot de passe"
                                        type="password"
                                        value={this.state.password}
                                        onChange={ev => this.setState({ password: ev.target.value })}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <Button type="primary">Submit</Button>
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
        authenticate: isAuthenticated => dispatch(authenticate(isAuthenticated))
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.common.isAuthenticated
    }
}
const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
export default Login