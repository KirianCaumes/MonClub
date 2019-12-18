import React from 'react'
import { Icon, Nav } from 'office-ui-fabric-react'
import { history } from '../../helper/history'
import { ROLE_ADMIN, ROLE_COACH, ROLE_SUPER_ADMIN } from '../../helper/constants'
import { connect } from 'react-redux'

class _Aside extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { me } = this.props
        
        return (
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
                    // onLinkClick={(ev, item) => history.push(item.key)}
                    groups={[
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
                            isDisplay: me?.roles?.includes(ROLE_ADMIN) || me?.roles?.includes(ROLE_SUPER_ADMIN),
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
                                    isDisplay: me?.roles?.includes(ROLE_COACH) || me?.roles?.includes(ROLE_ADMIN) || me?.roles?.includes(ROLE_SUPER_ADMIN)
                                },
                                {
                                    key: '/equipes',
                                    name: <><Icon iconName='Teamwork' /> Les équipes</>,
                                    title: 'Les équipes',
                                    onClick: () => history.push('/equipes'),
                                    isDisplay: me?.roles?.includes(ROLE_ADMIN) || me?.roles?.includes(ROLE_SUPER_ADMIN)
                                },
                            ]
                        },
                        {
                            name: 'Administration',
                            isDisplay: me?.roles?.includes(ROLE_SUPER_ADMIN),
                            links: [
                                {
                                    key: '/utilisateurs',
                                    name: <><Icon iconName='ContactList' /> Les comptes</>,
                                    title: 'Tous les comptes',
                                    onClick: () => history.push('/utilisateurs'),
                                    isDisplay: me?.roles?.includes(ROLE_SUPER_ADMIN)
                                },
                                {
                                    key: '/constantes',
                                    name: <><Icon iconName='OfflineStorage' /> Les constantes</>,
                                    title: 'Les constants',
                                    onClick: () => history.push('/constantes'),
                                    isDisplay: me?.roles?.includes(ROLE_SUPER_ADMIN)
                                },
                            ]
                        },
                        {
                            name: 'Autre',
                            isDisplay: me?.roles?.includes(ROLE_ADMIN) || me?.roles?.includes(ROLE_SUPER_ADMIN),
                            links: [
                                {
                                    key: '/stockage',
                                    name: <><Icon iconName='Cloud' /> Platforme de stockage</>,
                                    title: 'Platforme de stockage',
                                    onClick: () => history.push('/stockage'),
                                    isDisplay: me?.roles?.includes(ROLE_ADMIN) || me?.roles?.includes(ROLE_SUPER_ADMIN)
                                },
                            ]
                        },
                    ].filter(group => group.isDisplay).map(group => {
                        return {
                            ...group,
                            links: group.links.filter(link => link.isDisplay)
                        }
                    })}
                />
            </aside>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
    }
}
const Aside = connect(mapStateToProps, mapDispatchToProps)(_Aside)

export default Aside