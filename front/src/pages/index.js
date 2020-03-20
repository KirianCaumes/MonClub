import React from 'react'
import { Columns, Table, Hero, Container, Heading } from 'react-bulma-components'
import { Text, Icon, getTheme, Label, PrimaryButton } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand } from 'redux/actions/common'
import { Line, Doughnut } from 'react-chartjs-2'
import { stringToShortCleanString } from 'helper/date'
import { history } from 'helper/history'
import Divider from 'component/divider'
import { dateToCleanDateTimeString } from 'helper/date'
import getWf from 'helper/getStepWf'
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from 'helper/constants'
import Emoji from 'component/emoji'

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
        const { data, param } = this.props
        return (
            <section id="index">
                <Hero color="link" gradient className="card">
                    <Hero.Body>
                        <Container>
                            <Heading>
                                <Text as="p" block variant="xxLarge">Bienvenu sur Mon Club <Emoji symbol="🤾‍♀️" label="handball" /></Text>
                            </Heading>
                            <Heading subtitle>
                                <Text as="p" block variant="mediumPlus">
                                    {
                                        (this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)) ?
                                            `Retrouvez le status de l'inscription des membres du THBC`
                                            :
                                            `Retrouvez le status de l'inscription de vos membres au THBC`
                                    }
                                </Text>
                            </Heading>
                        </Container>
                    </Hero.Body>
                </Hero>

                <br />

                <Columns>
                    <Columns.Column size="two-thirds">
                        <div className="card">
                            <Text variant="large" block><Icon iconName='WavingHand' /> Bonjour <span className="is-capitalized">{this.props.me?.username?.split('@')?.[0]?.replace('.', ' ')}</span></Text>
                            <Divider />
                            <Text as="p" block>
                                <span dangerouslySetInnerHTML={{ __html: this.props.data?.text }} />
                            </Text>
                        </div>
                    </Columns.Column>
                    <Columns.Column size="one-third">
                        <div className="card">
                            <Text variant="large" block><Icon iconName='DonutChart' />&nbsp;
                                {
                                    (this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)) ?
                                        `Status des membres ${param?.season?.find(x => x.is_current)?.label}`
                                        :
                                        'Status de mes membres'
                                }

                            </Text>
                            <Divider />
                            {
                                data?.infos?.members > 0 ?
                                    <Doughnut
                                        data={{
                                            labels: ['En attente', 'Validés', 'Créés'],
                                            datasets: [
                                                {
                                                    data: [data?.infos?.membersPending, data?.infos?.membersOk, null],
                                                    backgroundColor: ['#FFCD56', '#FF6384', '#36A2EB', '#4BC0C0'],
                                                    borderWidth: 0.5
                                                },
                                                {
                                                    data: [null, null, (data?.infos?.members ? data?.infos?.members : 1)],
                                                    backgroundColor: ['#FFCD56', '#FF6384', '#36A2EB', '#4BC0C0'],
                                                    borderWidth: 0.5
                                                }
                                            ]
                                        }}
                                        legend={{
                                            position: 'right'
                                        }}
                                        options={{
                                            responsive: true,
                                            // maintainAspectRatio: false
                                        }}
                                    />
                                    :
                                    <>
                                        <Text>Aucun membre associé à votre compte trouvé</Text>
                                        <br /><br />
                                        <PrimaryButton
                                            text="Voir mes membres"
                                            onClick={() => history.push('membres/moi')}
                                            iconProps={{ iconName: 'AccountManagement' }}
                                        />
                                    </>
                            }
                        </div>
                    </Columns.Column>
                </Columns>
                {/* <br/> */}

                <Columns>
                    <Columns.Column size="two-thirds">
                        <div className="card">
                            <Text variant="large" block><Icon iconName='AccountManagement' /> Mes membres</Text>
                            <Divider />
                            <Table className="table is-narrow">
                                <thead>
                                    <tr>
                                        <th><Label>Nom</Label></th>
                                        <th><Label>Prénom</Label></th>
                                        <th><Label>Créé le</Label></th>
                                        <th><Label>Étape en cours</Label></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.members?.map((member, i) => (
                                            <tr key={i}>
                                                <td><Text className="is-capitalized">{member.lastname}</Text></td>
                                                <td><Text className="is-capitalized">{member.firstname}</Text></td>
                                                <td><Text>{dateToCleanDateTimeString(new Date(member.creation_datetime))}</Text></td>
                                                <td><Text className="is-capitalized">{getWf(member)}</Text></td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        !data?.members?.length &&
                                        <tr><td colSpan="4"><Text>Aucun membre associé à votre compte trouvé</Text></td></tr>
                                    }
                                </tbody>
                            </Table>
                            <PrimaryButton
                                text="Voir mes membres"
                                onClick={() => history.push('membres/moi')}
                                iconProps={{ iconName: 'AccountManagement' }}
                            />
                        </div>
                    </Columns.Column>
                    <Columns.Column size="one-third">
                        <div className="card">
                            <Text variant="large" block><Icon iconName='Help' /> Un soucis</Text>
                            <Divider />
                            <div style={{ textAlign: 'center' }}>
                                <Text>Contacter le thbc : <a href="mailto:thbc44@gmail.com">thbc44@gmail.com</a></Text>
                                <br />
                                <br />
                                <img src={require('asset/img/logo.png')} alt="THBC" />
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
                                <Line
                                    data={{
                                        labels: this.props?.data?.activity_historic.map(x => stringToShortCleanString(new Date(x.date))),
                                        datasets: [
                                            {
                                                data: this.props?.data?.activity_historic.map(x => x.sum),
                                                backgroundColor: getTheme().palette.themeLight,
                                                borderColor: getTheme().palette.themePrimary,
                                                hoverBackgroundColor: getTheme().palette.themeTertiary,
                                                hoverBorderColor: getTheme().palette.themePrimary,
                                                borderWidth: 0.5,
                                                pointRadius: 0
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
        me: state.user.me,
        param: state.user.param
    }
}
const Index = connect(mapStateToProps, mapDispatchToProps)(_Index)
export default Index
