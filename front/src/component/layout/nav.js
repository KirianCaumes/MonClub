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
                    // onLinkClick={(ev, item) => history.push(item.key)}
                    groups={[
                        {
                            name: '',
                            links: [
                                {
                                    key: '/',
                                    name: <><Icon iconName='Home' /> Accueil</>,
                                    title: 'Accueil',
                                    onClick: () => history.push('/')
                                },
                            ]
                        },
                        {
                            name: 'Membres',
                            links: [
                                {
                                    key: '/membres/moi',
                                    name: <><Icon iconName='AccountManagement' /> Mes membres</>,
                                    title: 'Mes membres',
                                    onClick: () => history.push('/membres/moi')
                                },
                                {
                                    key: '/membre/nouveau',
                                    name: <><Icon iconName='Add' /> Créer un membre</>,
                                    title: 'Créer un membre',
                                    onClick: () => history.push('/membre/nouveau')
                                },
                                {
                                    key: '/membres',
                                    name: <><Icon iconName='RecruitmentManagement' /> Les membres</>,
                                    title: 'Les membres',
                                    onClick: () => history.push('/membres')
                                },
                                {
                                    key: '/equipes',
                                    name: <><Icon iconName='Teamwork' /> Les équipes</>,
                                    title: 'Les équipes',
                                    onClick: () => history.push('/equipes')
                                },
                            ]
                        },
                        {
                            name: 'Administration',
                            links: [
                                {
                                    key: '/utilisateurs',
                                    name: <><Icon iconName='ContactList' /> Les comptes</>,
                                    title: 'Tous les comptes',
                                    onClick: () => history.push('/utilisateurs')
                                },
                                {
                                    key: '/constantes',
                                    name: <><Icon iconName='OfflineStorage' /> Les constantes</>,
                                    title: 'Les constants',
                                    onClick: () => history.push('/constantes')
                                },
                            ]
                        },
                        {
                            name: 'Autre',
                            links: [
                                {
                                    key: '/stockage',
                                    name: <><Icon iconName='Cloud' /> Platforme de stockage</>,
                                    title: 'Platforme de stockage',
                                    onClick: () => history.push('/stockage')
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