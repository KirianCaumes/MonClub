import React from 'react'
import request from '../helper/request'
import { Nav, CommandBar, IconBase, Icon, Breadcrumb, MessageBar, MessageBarType } from 'office-ui-fabric-react'
import Header from '../component/header';
import { authenticate, setUrl, setMessageBar } from '../redux/actions/common'
import { connect } from "react-redux"
import { history } from '../helper/history'
import { Depths } from '@uifabric/fluent-theme'
import '../style/_layout.scss'

const grey = '#F3F2F1';

class _Layout extends React.Component {
    componentDidMount() {
        this.props.setUrl(history.location.pathname)
    }

    render() {
        return (
            <>
                <Header />
                <div className="layout" >
                    <aside className="is-hidden-touch">
                        <Nav
                            styles={{
                                root: {
                                    width: 240,
                                    overflowY: 'auto'
                                },
                                chevronButton: {
                                    borderColor: "transparent"
                                }
                            }}
                            selectedKey={this.props.selectedKeyURL}
                            onLinkClick={(ev, item) => history.push(item.key)}
                            groups={[
                                {
                                    name: '',
                                    links: [
                                        {
                                            key: '/',
                                            name: <><Icon iconName='Home' /> Accueil</>,
                                            title: 'Accueil'
                                        },
                                    ]
                                },
                                {
                                    name: 'Membres',
                                    links: [
                                        {
                                            key: '/membre/nouveau',
                                            name: <><Icon iconName='Add' /> Nouveau membre</>,
                                            title: 'Nouveau membre'
                                        },
                                        {
                                            key: '/membres',
                                            name: <><Icon iconName='RecruitmentManagement' /> Tous les membres</>,
                                            title: 'Tous les membres'
                                        },
                                        {
                                            key: '/membres/moi',
                                            name: <><Icon iconName='AccountManagement' /> Mes membres</>,
                                            title: 'Mes membres'
                                        }
                                    ]
                                },
                                {
                                    name: 'Paramètres',
                                    links: [
                                        {
                                            key: '/utilisateurs',
                                            name: <><Icon iconName='ContactList' /> Tous les comptes</>,
                                            title: 'Tous les comptes'
                                        },
                                        {
                                            key: '/utilisateur',
                                            name: <><Icon iconName='Contact' /> Mon compte</>,
                                            title: 'Mon compte'
                                        }
                                    ]
                                },
                                {
                                    name: 'Autre',
                                    links: [
                                        {
                                            key: '/stockage',
                                            name: <><Icon iconName='Cloud' /> Platforme de stockage</>,
                                            title: 'Platforme de stockage'
                                        },
                                        {
                                            key: '/constants',
                                            name: <><Icon iconName='OfflineStorage' /> Les constants</>,
                                            title: 'Les constants'
                                        },
                                    ]
                                },
                            ]}
                        />
                    </aside>
                    <div className="main">
                        <CommandBar
                            styles={{
                                root: {
                                    background: grey,
                                },
                            }}
                            items={[
                                {
                                    key: 'newItem',
                                    text: 'New',
                                    iconProps: { iconName: 'Add' },
                                    buttonStyles: { root: { background: grey } },
                                    onClick: () => console.log('Calendar')
                                },
                                {
                                    key: 'upload',
                                    text: 'Upload',
                                    iconProps: { iconName: 'Upload' },
                                    buttonStyles: { root: { background: grey } },
                                    onClick: () => console.log('Upload')
                                },
                                {
                                    key: 'share',
                                    text: 'Share',
                                    iconProps: { iconName: 'Share' },
                                    buttonStyles: { root: { background: grey } },
                                    onClick: () => console.log('Share')
                                },
                                {
                                    key: 'download',
                                    text: 'Download',
                                    iconProps: { iconName: 'Download' },
                                    buttonStyles: { root: { background: grey } },
                                    onClick: () => console.log('Download')
                                }
                            ]}
                        />
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