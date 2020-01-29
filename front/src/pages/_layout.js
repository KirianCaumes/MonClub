import React from 'react'
import { Breadcrumb, MessageBar, CommandBar, Icon, Nav } from 'office-ui-fabric-react'
import Header from 'component/layout/header';
import { setUrl, setMessageBar } from 'redux/actions/common'
import { connect } from "react-redux"
import { history } from 'helper/history'
import { ROLE_COACH, ROLE_ADMIN, ROLE_SUPER_ADMIN } from 'helper/constants';

class _Layout extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            menu: [],
            posNav: 0,
            isBurgerOpen: true
        }
    }

    componentDidMount() {
        this.props.setUrl(history.location.pathname)
        // window.addEventListener('scroll', this.listenScroll)
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll', this.listenScroll)
    }

    listenScroll = () => {
        // if (this.scroll) clearTimeout(this.scroll)
        // this.scroll = setTimeout(() => this.setState({ posNav: window.scrollY > 95 ? window.scrollY - 95 : 0 }), 50)
    }

    componentDidUpdate(prevProps) {
        // if (prevProps.selectedKeyURL !== this.props.selectedKeyURL) {
        //     if (this.scroll) clearTimeout(this.scroll)
        //     this.setState({ posNav: 0 })
        //     window.scrollTo(0, 0)
        // }

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
                                name: <><Icon iconName='Home' /> {this.state.isBurgerOpen ? 'Accueil' : ''}</>,
                                title: 'Accueil',
                                onClick: () => history.push('/'),
                                isDisplay: true
                            },
                        ]
                    },
                    {
                        name: this.state.isBurgerOpen ? 'Membres' : '',
                        isDisplay: true,
                        links: [
                            {
                                key: '/membres/moi',
                                name: <><Icon iconName='AccountManagement' /> {this.state.isBurgerOpen ? 'Mes membres' : ''}</>,
                                title: 'Mes membres',
                                onClick: () => history.push('/membres/moi'),
                                isDisplay: true
                            },
                            {
                                key: '/membres',
                                name: <><Icon iconName='RecruitmentManagement' /> {this.state.isBurgerOpen ? 'Les membres' : ''}</>,
                                title: 'Les membres',
                                onClick: () => history.push('/membres'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_COACH) || this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                            {
                                key: '/equipes',
                                name: <><Icon iconName='Teamwork' /> {this.state.isBurgerOpen ? 'Les équipes' : ''}</>,
                                title: 'Les équipes',
                                onClick: () => history.push('/equipes'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                        ]
                    },
                    {
                        name: this.state.isBurgerOpen ? 'Administration' : '',
                        isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN),
                        links: [
                            {
                                key: '/utilisateurs',
                                name: <><Icon iconName='ContactList' /> {this.state.isBurgerOpen ? 'Les comptes' : ''}</>,
                                title: 'Tous les comptes',
                                onClick: () => history.push('/utilisateurs'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                            {
                                key: '/constantes',
                                name: <><Icon iconName='OfflineStorage' /> {this.state.isBurgerOpen ? 'Les constantes' : ''}</>,
                                title: 'Les constants',
                                onClick: () => history.push('/constantes'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                            {
                                key: '/parametres',
                                name: <><Icon iconName='DataManagementSettings' /> {this.state.isBurgerOpen ? 'Les paramètres' : ''}</>,
                                title: 'Les paramètres',
                                onClick: () => history.push('/parametres'),
                                isDisplay: this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)
                            },
                        ]
                    },
                    {
                        name: this.state.isBurgerOpen ? 'Autre' : '',
                        isDisplay: this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN),
                        links: [
                            {
                                key: '/stockage',
                                name: <><Icon iconName='Cloud' /> {this.state.isBurgerOpen ? 'Platforme de stockage' : ''}</>,
                                title: 'Platforme de stockage',
                                onClick: () => window.open(process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_DRIVE_DEV : process.env.REACT_APP_DRIVE_PROD, "_blank"),
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
        const { selectedKeyURL, breadcrumb, command, messageBar, me } = this.props
        const { menu, posNav, isBurgerOpen } = this.state

        if (!this.props.isDisplay) return this.props.children

        return (
            <>
                <Header
                    menu={this.filterMenu(menu)}
                    me={me}
                    refresh={() => this.props.refresh()}
                />
                <div className="layout" >
                    <aside className="is-hidden-touch" >
                        <Nav
                            styles={{
                                root: { width: isBurgerOpen ? 240 : 50, overflowY: 'auto', marginTop: posNav, transition: '.5s' },
                                chevronButton: { borderColor: "transparent" },
                                link: { padding: isBurgerOpen ? '0px 20px 0px 27px' : '0px 1.1em 0 0.9em' },
                                linkText: { overflow: isBurgerOpen ? 'hidden' : 'visible' }
                            }}
                            selectedKey={(() => {
                                if (selectedKeyURL.match(/\/membre\/.*/g)) {
                                    return '/membres'
                                } else if (selectedKeyURL.match(/\/equipe\/.*/g)) {
                                    return '/equipes'
                                } else if (selectedKeyURL.match(/\/utilisateur\/.*/g)) {
                                    return '/utilisateurs'
                                }
                                return selectedKeyURL
                            })()}
                            groups={this.filterMenu(menu)}
                        />
                    </aside>
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
                                    <MessageBar
                                        messageBarType={this.props.messageBar.type}
                                        isMultiline={true}
                                        onDismiss={() => this.props.setMessageBar(false)}
                                    >
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
