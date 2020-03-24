import React from 'react'
import { connect } from "react-redux"
import { Label, PrimaryButton, Text, MessageBarType, Spinner, SpinnerSize } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { signout } from 'redux/actions/user'
import PublicLayout from './_publicLayout'
import request from 'helper/request'
import { setMessageBar } from 'redux/actions/common'

class _ResetNewsletter extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        this.props.signout()
    }

    componentWillUnmount() {
        if (this.fetchResetNewsLetter) this.fetchResetNewsLetter.cancel()
    }

    handleSubmit(ev) {
        ev.preventDefault()

        this.setState({ isLoading: true }, () => {
            this.fetchResetNewsLetter = request.resetNewsLetter({ resetToken: this.props.match?.params?.resetToken })
            this.fetchResetNewsLetter
                .fetch()
                .then(() => {
                    this.props.setMessageBar(true, MessageBarType.success, 'Vous vous êtes bien désinscris de la newsletter')
                })
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => {
                    this.setState({ isLoading: false })
                })
        })
    }

    render() {
        return (
            <PublicLayout>
                <form onSubmit={this.handleSubmit.bind(this)} >
                    <Label>Êtes-vous certains de vouloir vous désinscrire de la Newsletter du THBC ?</Label>
                    <br />
                    <div className="flex-row" >
                        <PrimaryButton
                            iconProps={{ iconName: 'CheckMark' }}
                            text="Oui"
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
const ResetNewsletter = connect(mapStateToProps, mapDispatchToProps)(_ResetNewsletter)
export default ResetNewsletter