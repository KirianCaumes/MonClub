import React from 'react'
import { Hero, Container, Heading, Columns } from 'react-bulma-components'
import { Text, Icon, getTheme } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand } from 'redux/actions/common'
import { Bar } from 'react-chartjs-2'
import { stringToShortCleanString } from 'helper/date'
import { history } from 'helper/history'
import Divider from 'component/divider'

class _Index extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Accueil', key: 'accueil', isCurrentItem: true },
        ])
        this.props.setCommand([])
    }
    render() {
        return (
            <section id="index">
                <Hero color="info">
                    <Hero.Body>
                        <Container className="flex-row">
                            <img src={require('asset/img/logo.png')} alt="THBC" className="is-hidden-touch" />
                            <Heading className="is-capitalized flex-col">
                                Bienvenue : {this.props.me?.username}
                            </Heading>
                        </Container>
                    </Hero.Body>
                </Hero>
                <br />
                <br />
                <Columns className="is-vcentered is-desktop infos">
                    <Columns.Column>
                        <div className="card has-text-centered">
                            <div className="flex-col">
                                <Text variant="large" block>
                                    <Icon iconName='Contact' />&nbsp;<span dangerouslySetInnerHTML={{ __html: this.props.data?.text }}></span>
                                </Text>
                            </div>
                        </div>
                    </Columns.Column>
                    <Columns.Column>
                        <Columns className="is-vcentered" >
                            <Columns.Column>
                                <div className="card" onClick={() => history.push(`/membres/moi`)}>
                                    <div className="flex-col">
                                        <img src={require('asset/img/bg2.jpg')} alt="THBC" />
                                        <div style={{ height: '12.5px' }} />
                                        <Text variant="large" nowrap block>
                                            Mes membres
                                        </Text>
                                        <Divider style={{ marginBottom: 0 }} />
                                    </div>
                                </div>
                            </Columns.Column>
                            <Columns.Column>
                                <div className="card" onClick={() => null} style={{ cursor: 'not-allowed' }}>
                                    <div className="flex-col">
                                        <img src={require('asset/img/bg2.jpg')} alt="THBC" />
                                        <div style={{ height: '12.5px' }} />
                                        <Text variant="large" nowrap block>
                                            La boutique
                                        </Text>
                                        <Divider style={{ marginBottom: 0 }} />
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                    </Columns.Column>
                </Columns>

                <Columns className="is-vcentered kpi">
                    {this.props.data?.infos?.users &&
                        <Columns.Column>
                            <div className="card has-text-centered">
                                <div className="flex-col">
                                    <Text variant="xxLarge" nowrap block>
                                        <Icon iconName='ContactList' />&nbsp;{this.props.data?.infos?.users}
                                    </Text>
                                    <Text variant="large" nowrap block>
                                        Utilisateurs inscris
                                        </Text>
                                </div>
                            </div>
                        </Columns.Column>
                    }
                    <Columns.Column>
                        <div className="card has-text-centered">
                            <div className="flex-col">
                                <Text variant="xxLarge" nowrap block>
                                    <Icon iconName='RecruitmentManagement' />&nbsp;{this.props.data?.infos?.members}
                                </Text>
                                <Text variant="large" nowrap block>
                                    Membres créés
                                </Text>
                            </div>
                        </div>
                    </Columns.Column>
                    <Columns.Column>
                        <div className="card has-text-centered">
                            <div className="flex-col">
                                <Text variant="xxLarge" nowrap block>
                                    <Icon iconName='UserFollowed' />&nbsp;{this.props.data?.infos?.membersOk}
                                </Text>
                                <Text variant="large" nowrap block>
                                    Membres validés
                                        </Text>
                            </div>
                        </div>
                    </Columns.Column>
                    <Columns.Column>
                        <div className="card has-text-centered">
                            <div className="flex-col">
                                <Text variant="xxLarge" nowrap block>
                                    <Icon iconName='UserOptional' />&nbsp;{this.props.data?.infos?.membersPending}
                                </Text>
                                <Text variant="large" nowrap block>
                                    Membre en attente
                                        </Text>
                            </div>
                        </div>
                    </Columns.Column>
                </Columns>

                {this.props?.data?.activity_historic?.length > 0 &&
                    <>
                        <div className="card graph">
                            <Text variant="large" className="has-text-centered" block>Activité sur les 30 derniers jours</Text>
                            <br />
                            <div>
                                <Bar
                                    data={{
                                        labels: this.props?.data?.activity_historic.map(x => stringToShortCleanString(new Date(x.date))),
                                        datasets: [
                                            {
                                                data: this.props?.data?.activity_historic.map(x => x.sum),
                                                backgroundColor: getTheme().palette.themeLight,
                                                borderColor: getTheme().palette.themePrimary,
                                                hoverBackgroundColor: getTheme().palette.themeTertiary,
                                                hoverBorderColor: getTheme().palette.themePrimary,
                                                borderWidth: 0.5
                                            }
                                        ]
                                    }}
                                    legend={{
                                        display: false
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>

                        <br />
                    </>
                }
                <br />

                <div className="card has-text-centered contact">
                    <p>En cas de soucis, veuillez contacter le club : <a href="mailto:thbc44@gmail.com">thbc44@gmail.com</a></p>
                </div>
            </section>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: data => dispatch(setBreadcrumb(data)),
        setCommand: data => dispatch(setCommand(data))
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me
    }
}
const Index = connect(mapStateToProps, mapDispatchToProps)(_Index)
export default Index
