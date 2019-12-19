import React from 'react'
import { Breadcrumb, MessageBar, CommandBar, Icon } from 'office-ui-fabric-react'
import Header from '../component/layout/header';
import { setUrl, setMessageBar } from '../redux/actions/common'
import { connect } from "react-redux"
import { history } from '../helper/history'
import Aside from '../component/layout/nav'
import { ROLE_COACH, ROLE_ADMIN, ROLE_SUPER_ADMIN } from '../helper/constants';

class _Layout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menu: []
        }
    }

    componentDidMount() {
        this.props.setUrl(history.location.pathname)
    }

    componentDidUpdate(prevProps) {
        //Re render menu if user when info user change 
        if (prevProps.me !== this.props.me) {
            this.setState({
                menu: [

                    {
                        name: '',
                        isDisplay: true,
                        links: [
                            {
                                key: '/',
                                name: <><Icon iconName='Home' /> Accueil</>,
                                title: 'Accueil',
                                onClick: () => history.push('/'),
                                isDisplay: true
                            },
                        ]
                    },
                    {
                        name: 'Membres',
                        isDisplay: true,
                        links: [
                            {
                                key: '/membres/moi',
                                name: <><Icon iconName='AccountManagement' /> Mes membres</>,
                                title: 'Mes membres',
                                onClick: () => history.push('/membres/moi'),
                                isDisplay: true
                            },
                            {
                                key: '/membres',
                                name: <><Icon iconName='RecruitmentManagement' /> Les membres</>,
                                title: 'Les membres',
                                onClick: () => history.push('/membres'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_COACH) || this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                            {
                                key: '/equipes',
                                name: <><Icon iconName='Teamwork' /> Les équipes</>,
                                title: 'Les équipes',
                                onClick: () => history.push('/equipes'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                        ]
                    },
                    {
                        name: 'Administration',
                        isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN),
                        links: [
                            {
                                key: '/utilisateurs',
                                name: <><Icon iconName='ContactList' /> Les comptes</>,
                                title: 'Tous les comptes',
                                onClick: () => history.push('/utilisateurs'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                            {
                                key: '/constantes',
                                name: <><Icon iconName='OfflineStorage' /> Les constantes</>,
                                title: 'Les constants',
                                onClick: () => history.push('/constantes'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                        ]
                    },
                    {
                        name: 'Autre',
                        isDisplay: this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN),
                        links: [
                            {
                                key: '/stockage',
                                name: <><Icon iconName='Cloud' /> Platforme de stockage</>,
                                title: 'Platforme de stockage',
                                onClick: () => history.push('/stockage'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                        ]
                    },
                ]
            })
        }
    }

    filterMenu(menu) {
        return menu
            .filter(group => group.isDisplay)
            .map(group => {
                return {
                    ...group,
                    links: group.links.filter(link => link.isDisplay)
                }
            })
    }

    render() {
        const { selectedKeyURL, breadcrumb, command, messageBar } = this.props
        const { menu } = this.state

        if (!this.props.isDisplay) return this.props.children

        return (
            <>
                <Header menu={this.filterMenu(menu)} />
                <div className="layout" >
                    <Aside selectedKeyURL={selectedKeyURL} menu={this.filterMenu(menu)} />
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
        me: state.user.me,
        messageBar: state.common.messageBar,
        breadcrumb: state.common.breadcrumb,
        command: state.common.command
    }
}

const Layout = connect(mapStateToProps, mapDispatchToProps)(_Layout)
export default Layout
