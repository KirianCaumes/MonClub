import React from 'react'
import Loader from 'component/loader'
import { connect } from 'react-redux'
import { MessageBarType } from 'office-ui-fabric-react'
import { setMessageBar, setCommand } from 'redux/actions/common'

export default function withData(WrappedComponent, dataFunc) {
    class _WithData extends React.PureComponent {
        constructor(props) {
            super(props)
            this.state = {
                isLoading: true,
                isError: false
            }
        }

        componentDidMount() {
            this.props.setCommand([])
            dataFunc(this.props.match?.params)
                .then(data => this.setState({ data }))
                .catch(err => {
                    this.setState({ isError: true })
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => this.setState({ isLoading: false }))
        }

        render() {
            return this.state.isLoading ?
                <Loader />
                :
                this.state.isError ?
                    null
                    :
                    <WrappedComponent data={this.state.data} {...this.props} />;
        }
    }

    const mapDispatchToProps = dispatch => {
        return {
            setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
            setCommand: data => dispatch(setCommand(data)),
        }
    }

    const mapStateToProps = state => {
        return {}
    }
    return connect(mapStateToProps, mapDispatchToProps)(_WithData)
}