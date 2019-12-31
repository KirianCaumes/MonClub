import React from 'react'
import { Separator, Text, MessageBarType, DefaultButton, PrimaryButton, ChoiceGroup, MessageBar } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../../redux/actions/common'
import { editMember, setMembers } from '../../../redux/actions/member'
import request from '../../../helper/request'
import { Table } from 'react-bulma-components'
import Loader from '../../../component/loader'

class _MembersMePayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: [],
            isLoading: true,
            optionSelectedKey: ''
        }
    }

    componentDidMount() {
        request.getMeMemberPrices()
            .then(res => this.setState({ summary: res.price }))
            .catch(err => {
                this.props.goBack()
                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue lors du calcul du montant.')
            })
            .finally(() => this.setState({ isLoading: false }))
    }

    pay() {
        request.pay({ payment_solution: this.state.optionSelectedKey })
            .then(res => {
                this.props.setMessageBar(true, MessageBarType.success, 'Votre paiement a bien été pris en compte.')
                this.props.setMembers(res)
                this.props.goNext()
            })
            .catch(err => {
                this.setState({ isLoading: false })
                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
            })
    }

    render() {
        const { summary, isLoading, optionSelectedKey } = this.state
        const { param } = this.props

        if (isLoading) return <Loader />

        return (
            <section id="members-me-paypal">
                <Text variant="large" block>Paiement</Text>
                <Separator />
                <MessageBar messageBarType={MessageBarType.warning} isMultiline={true} >
                    Attention, veuillez vérifier que tous les membres de votre famille ont bien été ajoutées et leurs documents sont complétés.<br />
                    Pour ajouter un nouveau membre, cliquez sur le bouton "Ajouter un membre" en haut de l'écran. Pour revenir en arrière, appuyant sur le bouton "Retour" en bas de l'écran.
                </MessageBar>
                <br />
                <Text variant="large" block>Détails du paiement (des membres non payés)</Text>
                <Separator />
                <Table>
                    <thead>
                        <tr>
                            <th>Licencié(s)</th>
                            <th>À payer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary?.each?.map((el, i) => {
                            return (
                                <tr key={i}>
                                    <td>{el.name}</td>
                                    <td>{el.price} €</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>TOTAL</th>
                            <th>{summary.total} €</th>
                        </tr>
                    </tfoot>
                </Table>
                <br />
                <Text variant="large" block>Choisissez votre mode de paiement</Text>
                <Separator />
                <ChoiceGroup
                    options={param?.price?.payement_solution.map(x => { return { key: x.id, text: x.label, iconProps: { iconName: x.icon } } })}
                    selectedKey={optionSelectedKey}
                    onChange={(ev, option) => this.setState({ optionSelectedKey: option.key })}
                />
                {
                    optionSelectedKey &&
                    <>
                        <br /><br />
                        <Text variant="large" block>Procédez au paiement</Text>
                        <Separator />

                        {
                            (() => {
                                switch (optionSelectedKey) {
                                    case 1:
                                        return (
                                            <PrimaryButton
                                                text="Paypal"
                                                iconProps={{ iconName: param?.price?.payement_solution.find(x => x.id === optionSelectedKey)?.icon }}
                                                styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                onClick={() => this.pay()}
                                                disabled={true}
                                            />
                                        )
                                    case 2:
                                        return (
                                            <>
                                                <Text>
                                                    Veuillez déposer votre cheque et le(s) coupon(s) dans la boite au lettre du club (accompagné de votre nom), pres du parking de la salle de sport à l'adresse :<br />
                                                    <b>
                                                        Parc des Sports<br />
                                                        Route de la Barre<br />
                                                        Thouaré-sur-Loire 44470
                                                    </b>
                                                </Text>
                                                <br /><br />
                                                <Text>
                                                    En appuyant sur le bouton suivant, je reconnais la véracité des informations saisie et m'engage à déposer mon paiement dans les plus bref délais.<br />
                                                    L'inscription ne sera <b>pas considérée comme valide tant que le paiement n'aura pas été validé</b>, et <b>il ne sera pas possible pour le licencié de participer aux entraînements et aux matchs</b>.
                                                </Text>
                                                <br />
                                                <PrimaryButton
                                                    text="Je valide"
                                                    iconProps={{ iconName: param?.price?.payement_solution.find(x => x.id === optionSelectedKey)?.icon }}
                                                    styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                    onClick={() => this.pay()}
                                                />
                                            </>
                                        )
                                    case 3:
                                        return (
                                            <>
                                                <Text>
                                                    Veuillez déposer votre cheque (accompagné de votre nom) dans la boite au lettre du club, pres du parking de la salle de sport à l'adresse :<br />
                                                    <b>
                                                        Parc des Sports<br />
                                                        Route de la Barre<br />
                                                        Thouaré-sur-Loire 44470
                                                    </b>
                                                </Text>
                                                <br /><br />
                                                <Text>
                                                    En appuyant sur le bouton suivant, je reconnais la véracité des informations saisie et m'engage à déposer mon paiement dans les plus bref délais.<br />
                                                    L'inscription ne sera <b>pas considérée comme valide tant que le paiement n'aura pas été validé</b>, et <b>il ne sera pas possible pour le licencié de participer aux entraînements et aux matchs</b>.
                                                </Text>
                                                <br />
                                                <PrimaryButton
                                                    text="Je valide"
                                                    iconProps={{ iconName: param?.price?.payement_solution.find(x => x.id === optionSelectedKey)?.icon }}
                                                    styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                    onClick={() => this.pay()}
                                                />
                                            </>
                                        )
                                    default:
                                        return (null)
                                }
                            })()
                        }
                    </>
                }
                <Separator />
                <br />
                <div className="flex-row flex-space-between">
                    <DefaultButton
                        text="Retour"
                        iconProps={{ iconName: 'Previous' }}
                        onClick={() => this.props.goBack()}
                    />
                    <div />
                    {/* <PrimaryButton
                        text="Payer"
                        iconProps={{ iconName: 'Next' }}
                        styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                        onClick={() => this.props.goNext()}
                    /> */}
                </div>
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: member => dispatch(setBreadcrumb(member)),
        setCommand: member => dispatch(setCommand(member)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
        editMember: (member, index) => dispatch(editMember(member, index)),
        setMembers: members => dispatch(setMembers(members)),
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        param: state.user.param,
        members: state.member.members
    }
}
const MembersMePayment = connect(mapStateToProps, mapDispatchToProps)(_MembersMePayment)
export default MembersMePayment
