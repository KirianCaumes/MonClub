import React from 'react'
import request from '../helper/request'
import { Nav, CommandBar, IconBase, Icon } from 'office-ui-fabric-react'
import Header from '../component/header';
import { authenticate, setUrl } from '../redux/actions'
import { connect } from "react-redux"
import { history } from '../helper/history'
import { Depths } from '@uifabric/fluent-theme'
import '../style/page/index.scss'

const grey = 'hsl(0, 0%, 86%)';

class _Layout extends React.Component {
    componentDidMount() {
        this.props.setUrl(history.location.pathname)
    }

    render() {
        return (
            <>
                <Header />
                <div class="layout" >
                    <aside className="is-hidden-touch has-background-grey-lighter">
                        <br /><br />
                        <Nav
                            styles={{
                                root: {
                                    width: 220,
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
                    <div class="main">
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
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'emailMessage',
                                                text: 'Email message',
                                                iconProps: { iconName: 'Mail' },
                                                onClick: () => console.log('Mail')
                                            },
                                            {
                                                key: 'calendarEvent',
                                                text: 'Calendar event',
                                                iconProps: { iconName: 'Calendar' },
                                                onClick: () => console.log('Calendar')
                                            }
                                        ]
                                    }
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
                        <div className="content" style={{ boxShadow: `inset ${Depths.depth8}` }}>
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
        setUrl: selectedKeyURL => dispatch(setUrl(selectedKeyURL))
    }
}

const mapStateToProps = state => {
    return {
        selectedKeyURL: state.common.selectedKeyURL,
        me: state.common.me
    }
}

const Layout = connect(mapStateToProps, mapDispatchToProps)(_Layout)
export default Layout
