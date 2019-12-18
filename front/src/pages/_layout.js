import React from 'react'
import { Breadcrumb, MessageBar, CommandBar } from 'office-ui-fabric-react'
import Header from '../component/layout/header';
import { setUrl, setMessageBar } from '../redux/actions/common'
import { connect } from "react-redux"
import { history } from '../helper/history'
import Aside from '../component/layout/nav'

class _Layout extends React.Component {

    componentDidMount() {
        this.props.setUrl(history.location.pathname)
    }

    render() {
        const { selectedKeyURL, breadcrumb, command, messageBar } = this.props
        if (!this.props.isDisplay) return this.props.children
        return (
            <>
                <Header />
                <div className="layout" >
                    <Aside selectedKeyURL={selectedKeyURL} />
                    <div className="main">
                        <CommandBar
                            items={command}
                        />
                        <div className="content">
                            <Breadcrumb
                                items={breadcrumb}
                                maxDisplayedItems={5}
                            />
                            {
                                messageBar?.isDisplayed &&
                                <>
                                    <MessageBar messageBarType={this.props.messageBar.type} isMultiline={true} onDismiss={() => this.props.setMessageBar(false)}>
                                        {messageBar.message}
                                    </MessageBar>
                                    <br />
                                </>
                            }
                            {this.props.children}
                            <br />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUrl: selectedKeyURL => dispatch(setUrl(selectedKeyURL)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        selectedKeyURL: state.common.selectedKeyURL,
        me: state.common.me,
        messageBar: state.common.messageBar,
        breadcrumb: state.common.breadcrumb,
        command: state.common.command
    }
}

const Layout = connect(mapStateToProps, mapDispatchToProps)(_Layout)
export default Layout
