import React from 'react'
import { Text, MessageBarType, Icon } from 'office-ui-fabric-react'
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

        let deadlineDate = new Date(param?.global?.find(x => x.label === 'price_deadline')?.value)
        let deadlineDateAfter = (new Date(deadlineDate.getTime()))
        deadlineDateAfter.setDate(deadlineDate.getDate() + 1)

        return (
            <section id="members-me-summary">
                <Text variant="large" block><Icon iconName='ClipboardList'/> Récapitulatif du montant</Text>
                <Divider />
                <Text className="has-text-justified" block>Retrouvez le récapitulatif détaillé du montant qu'il vous sera demandé de payer <b>(sont surlignées en vert les informations vous correspondantes)</b>. Si le tarif proposé ne correspond pas, veuillez retourner en arrière pour modifier vos informations.</Text>
                <br /><br />
                <Text variant="large" block><Icon iconName='NumberedList'/> Tarifs</Text>
                <Divider />
                <Table>
                    <thead>
                        <tr>
                            <th>Année de naissance</th>
                            {
                                deadlineDate >= new Date()
                                    ?
                                    <>
                                        <th>Tarifs jusqu'au {dateToCleanDateString(deadlineDate)}</th>
                                        <th>Tarifs à partir {dateToCleanDateString(deadlineDateAfter)}</th>
                                    </>
                                    :
                                    <>
                                        <th>Tarifs à partir {dateToCleanDateString(deadlineDateAfter)}</th>
                                        <th>Tarifs jusqu'au {dateToCleanDateString(deadlineDate)}</th>
                                    </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {param?.price?.license?.map((el, i) => {
                            let currInterval = !member?.is_reduced_price && el.min_year <= getYear(member?.birthdate) && el.max_year >= getYear(member?.birthdate)
                            return (
                                <tr key={i} >
                                    <td className={currInterval ? 'is-selected' : ''} >{el.label}</td>
                                    {
                                        deadlineDate >= new Date()
                                            ?
                                            <>
                                                <td className={deadlineDate >= new Date() && currInterval ? 'is-selected' : ''}>{el.price_before_deadline} €</td>
                                                <td className={deadlineDate < new Date() && currInterval ? 'is-selected' : ''}>{el.price_after_deadline} €</td>
                                            </>
                                            :
                                            <>
                                                <td className={deadlineDate < new Date() && currInterval ? 'is-selected' : ''}>{el.price_after_deadline} €</td>
                                                <td className={deadlineDate >= new Date() && currInterval ? 'is-selected' : ''}>{el.price_before_deadline} €</td>
                                            </>
                                    }
                                </tr>
                            )
                        })}
                        <tr>
                            <td className={member?.is_reduced_price ? 'is-selected' : ''} >
                                Loisirs - Etudiants - Chômeurs
                            </td>
                            {
                                deadlineDate >= new Date()
                                    ?
                                    <>
                                        <td className={deadlineDate >= new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            {param?.global?.find(x => x.label === 'reduced_price_before_deadline')?.value} €
                                        </td>
                                        <td className={deadlineDate < new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            {param?.global?.find(x => x.label === 'reduced_price_after_deadline')?.value} €
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td className={deadlineDate < new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            {param?.global?.find(x => x.label === 'reduced_price_after_deadline')?.value} €
                                        </td>
                                        <td className={deadlineDate >= new Date() && member?.is_reduced_price ? 'is-selected' : ''}>
                                            {param?.global?.find(x => x.label === 'reduced_price_before_deadline')?.value} €
                                        </td>
                                    </>
                            }
                        </tr>
                    </tbody>
                </Table>
                <br />
                <Text variant="large" block className={!member?.is_transfer_needed ? 'is-line-through' : ''}><Icon iconName='NumberedList'/> Droits de mutation à la charge du nouveau licensié (coût ligue)</Text>
                <Divider />
                <Table className={!member?.is_transfer_needed ? 'is-line-through' : ''}>
                    <thead>
                        <tr>
                            <th>Age</th>
                            <th>Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        {param?.price?.transfer?.map((el, i) => {
                            let currInterval = member?.is_transfer_needed && el.min_age <= getAge(member?.birthdate) && el.max_age >= getAge(member?.birthdate)
                            return (
                                <tr key={i} className={currInterval ? 'is-selected' : ''} >
                                    <td>{el.label}</td>
                                    <td>{el.price} €</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <br />
                <Text variant="large" block ><Icon iconName='NumberedList'/> Hand en famille (remise valable pour <b>les membres de la même famille</b>)</Text>
                <Divider />
                <Table>
                    <thead>
                        <tr>
                            <th>Licence</th>
                            <th>Réduction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {param?.price?.discount?.map((el, i) => {
                            let currInterval = i === memberIndex
                            return (
                                <tr key={i} className={currInterval ? 'is-selected' : ''} >
                                    <td>{el.number}<sup>è</sup> license</td>
                                    <td>-{el.discount} €</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <br />
                <Text variant="large" block ><Icon iconName='NumberSymbol'/> Total à payer pour ce membre: <b>{price} €</b></Text>
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
