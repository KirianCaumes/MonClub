import React from 'react'
import { Text, MessageBarType, Icon, Label } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { editMember } from 'redux/actions/member'
import { Table } from 'react-bulma-components'
import { dateToCleanDateString, getYear, getAge } from 'helper/date'
import request from 'helper/request'
import Divider from 'component/divider'

class _MembersMeSummary extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            price: 0
        }
    }

    componentDidMount() {
        request.getMemberPrice(this.props?.members?.[this.props?.memberIndex]?.id)
            .then(res => this.setState({ price: res.price }))
            .catch(err => {
                this.setState({ price: 'Erreur' })
                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue lors du calcul du montant.')
            })
    }

    render() {
        const { price } = this.state
        const { memberIndex, param } = this.props
        const member = this.props.members[memberIndex]

        let deadlineDate = new Date(param?.price?.global?.deadline_date)
        let deadlineDateAfter = (new Date(deadlineDate.getTime()))
        deadlineDateAfter.setDate(deadlineDate.getDate() + 1)

        return (
            <section id="members-me-summary">
                <Text variant="large" block><Icon iconName='ClipboardList' /> Récapitulatif du montant</Text>
                <Divider />
                <Text className="has-text-justified" block>Retrouvez le récapitulatif détaillé du montant qu'il vous sera demandé de payer <b>(sont surlignées en vert les informations vous correspondantes)</b>. Si le tarif proposé ne correspond pas, veuillez retourner en arrière pour modifier vos informations.</Text>
                <br /><br />
                <Text variant="large" block><Icon iconName='NumberedList' /> Tarifs</Text>
                <Divider />
                <Table>
                    <thead>
                        <tr>
                            <th><Label>Année de naissance</Label></th>
                            {
                                deadlineDate >= new Date()
                                    ?
                                    <>
                                        <th><Label>Tarifs jusqu'au {dateToCleanDateString(deadlineDate)}</Label></th>
                                        <th><Label>Tarifs à partir {dateToCleanDateString(deadlineDateAfter)}</Label></th>
                                    </>
                                    :
                                    <>
                                        <th><Label>Tarifs à partir {dateToCleanDateString(deadlineDateAfter)}</Label></th>
                                        <th><Label>Tarifs jusqu'au {dateToCleanDateString(deadlineDate)}</Label></th>
                                    </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {param?.price?.license?.map((el, i) => {
                            let currInterval = !member?.is_reduced_price && el.min_year <= getYear(member?.birthdate) && el.max_year >= getYear(member?.birthdate)
                            return (
                                <tr key={i} >
                                    <td className={currInterval ? 'is-selected' : ''} ><Text>{el.label}</Text></td>
                                    {
                                        deadlineDate >= new Date()
                                            ?
                                            <>
                                                <td className={deadlineDate >= new Date() && currInterval ? 'is-selected' : ''}><Text>{el.price_before_deadline} €</Text></td>
                                                <td className={deadlineDate < new Date() && currInterval ? 'is-selected' : ''}><Text>{el.price_after_deadline} €</Text></td>
                                            </>
                                            :
                                            <>
                                                <td className={deadlineDate < new Date() && currInterval ? 'is-selected' : ''}><Text>{el.price_after_deadline} €</Text></td>
                                                <td className={deadlineDate >= new Date() && currInterval ? 'is-selected' : ''}><Text>{el.price_before_deadline} €</Text></td>
                                            </>
                                    }
                                </tr>
                            )
                        })}
                        <tr>
                            <td className={member?.is_reduced_price ? 'is-selected' : ''} >
                                <Text>Loisirs - Etudiants - Chômeurs</Text>
                            </td>
                            {
                                deadlineDate >= new Date()
                                    ?
                                    <>
                                        <td className={deadlineDate >= new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            <Text>{param?.price?.global?.reduced_price_before_deadline} €</Text>
                                        </td>
                                        <td className={deadlineDate < new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            <Text>{param?.price?.global?.reduced_price_after_deadline} €</Text>
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td className={deadlineDate < new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            <Text>{param?.price?.global?.reduced_price_after_deadline} €</Text>
                                        </td>
                                        <td className={deadlineDate >= new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            <Text>{param?.price?.global?.reduced_price_before_deadline} €</Text>
                                        </td>
                                    </>
                            }
                        </tr>
                    </tbody>
                </Table>
                <br />
                <Text variant="large" block className={!member?.is_transfer_needed ? 'is-line-through' : ''}><Icon iconName='NumberedList' /> Droits de mutation à la charge du nouveau licensié (coût ligue)</Text>
                <Divider />
                <Table className={!member?.is_transfer_needed ? 'is-line-through' : ''}>
                    <thead>
                        <tr>
                            <th><Label>Age</Label></th>
                            <th><Label>Prix</Label></th>
                        </tr>
                    </thead>
                    <tbody>
                        {param?.price?.transfer?.map((el, i) => {
                            let currInterval = member?.is_transfer_needed && el.min_age <= getAge(member?.birthdate) && el.max_age >= getAge(member?.birthdate)
                            return (
                                <tr key={i} className={currInterval ? 'is-selected' : ''} >
                                    <td><Text>{el.label}</Text></td>
                                    <td><Text>{el.price} €</Text></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <br />
                <Text variant="large" block ><Icon iconName='NumberedList' /> Hand en famille (remise valable pour <b>les membres de la même famille</b>)</Text>
                <Divider />
                <Table>
                    <thead>
                        <tr>
                            <th><Label>Licence</Label></th>
                            <th><Label>Réduction</Label></th>
                        </tr>
                    </thead>
                    <tbody>
                        {param?.price?.discount?.map((el, i) => {
                            let currInterval = i === memberIndex
                            return (
                                <tr key={i} className={currInterval ? 'is-selected' : ''} >
                                    <td><Text>{el.number}<sup>è</sup> license</Text></td>
                                    <td><Text>-{el.discount} €</Text></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <br />
                <Text variant="large" block ><Icon iconName='NumberSymbol' /> Total à payer pour ce membre: <b>{price} €</b></Text>
                <br />
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: member => dispatch(setBreadcrumb(member)),
        setCommand: member => dispatch(setCommand(member)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
        editMember: (member, index) => dispatch(editMember(member, index))
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        param: state.user.param,
        members: state.member.members
    }
}
const MembersMeSummary = connect(mapStateToProps, mapDispatchToProps)(_MembersMeSummary)
export default MembersMeSummary
