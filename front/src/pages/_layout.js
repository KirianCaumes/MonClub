import React from 'react'
import { Breadcrumb, MessageBar } from 'office-ui-fabric-react'
import Header from '../component/layout/header';
import { setUrl, setMessageBar } from '../redux/actions/common'
import { connect } from "react-redux"
import { history } from '../helper/history'
import { Depths } from '@uifabric/fluent-theme'
import '../style/_layout.scss'
import Aside from '../component/layout/nav';
import Command from '../component/layout/command';

const grey = '#F3F2F1';

class _Layout extends React.Component {
    
    componentDidMount() {
        this.props.setUrl(history.location.pathname)
    }

    render() {
        if (!this.props.isDisplay) return null
        return (
            <>
                <Header />
                <div className="layout" >
                    <Aside selectedKeyURL={this.props.selectedKeyURL} />
                    <div className="main">
                        <Command backgroundColor={grey} />
                        <div className="content" style={{ boxShadow: `inset ${Depths.depth4}` }}>
                            <Breadcrumb
                                items={[
                                    { text: 'Files', key: 'Files', onClick: () => null },
                                    { text: 'Folder 1', key: 'f1', onClick: () => null },
                                    { text: 'Folder 5', key: 'f5', onClick: () => null, isCurrentItem: true }
                                ]}
                                maxDisplayedItems={5}
                            />
                            {
                                this.props.messageBar?.isDisplayed &&
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
        messageBar: state.common.messageBar
    }
}

const Layout = connect(mapStateToProps, mapDispatchToProps)(_Layout)
export default Layout
