import React from 'react'
import { Columns } from 'react-bulma-components'
import { connect } from "react-redux"
import { Text, MessageBar } from 'office-ui-fabric-react'
import { setMessageBar } from '../../redux/actions/common'

class _PublicLayout extends React.Component {
    render() {
        return (
            <section id="login">
                <Columns>
                    <Columns.Column className="is-hidden-touch" />

                    <Columns.Column>
                        <div className="flex-col">
                            <div className="card has-text-centered">
                                <img src={require('../../asset/img/logo.png')} alt="THBC" />
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
                                {this.props.children}
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
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        messageBar: state.common.messageBar
    }
}
const PublicLayout = connect(mapStateToProps, mapDispatchToProps)(_PublicLayout)
export default PublicLayout