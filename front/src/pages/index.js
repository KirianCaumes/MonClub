import React from 'react'
import { Hero, Container, Heading, Columns } from 'react-bulma-components'
import { Text, Icon, getTheme } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand } from 'redux/actions/common'
import { Bar } from 'react-chartjs-2'
import { stringToCleanString } from 'helper/date'

class _Index extends React.Component {
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
                                Bienvenue : {this.props.me?.username?.split('@')?.[0]}
                            </Heading>
                        </Container>
                    </Hero.Body>
                </Hero>
                <br />
                <Columns className="is-vcentered is-desktop">
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
                        <Columns>
                            {this.props.data?.infos?.users &&
                                <Columns.Column>
                                    <div className="card has-text-centered">
                                        <div className="flex-col">
                                            <Text variant="xxLarge" nowrap block>
                                                <Icon iconName='ContactList' />&nbsp;{this.props.data?.infos?.users}
                                            </Text>
                                            <Text variant="large" nowrap block>
                                                Utilisateurs
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
                                            Membres
                                        </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                        <Columns>
                            <Columns.Column>
                                <div className="card has-text-centered">
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='UserFollowed' />&nbsp;{this.props.data?.infos?.membersOk}
                                        </Text>
                                        <Text variant="large" block>
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
                                        <Text variant="large" block>
                                            Membre en attente
                                        </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                    </Columns.Column>
                </Columns>
                {false &&
                    <>
                        <div className="card">
                            <Text variant="large" className="has-text-centered" block>Activité sur les 30 derniers jours</Text>
                            <br />
                            <Bar
                                data={{
                                    labels: (() => {
                                        let data = []
                                        let today = new Date()
                                        for (let i = 0; i < 30; i++) data.push(stringToCleanString(new Date().setDate(today.getDate() - i)))
                                        return data.reverse()
                                    })(),
                                    datasets: [
                                        {
                                            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
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
                            />
                        </div>

                        <br />
                    </>
                }

                <div className="card has-text-centered">
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
