import React from 'react'
import { Icon, Nav } from 'office-ui-fabric-react'
import { history } from '../../helper/history'

class Aside extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
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
        )
    }
}

export default Aside