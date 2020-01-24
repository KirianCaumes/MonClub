import React from 'react'
import { Text, MessageBarType, DefaultButton, PrimaryButton, ChoiceGroup, MessageBar, Icon, MaskedTextField, Separator, TooltipHost, DirectionalHint, TooltipDelay } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { editMember, setMembers } from 'redux/actions/member'
import request from 'helper/request'
import { Table } from 'react-bulma-components'
import Loader from 'component/loader'
import Divider from 'component/divider'

class _MembersMePayment extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            summary: {},
            isLoading: true,
            paymentKey: 3
        }
    }

    componentDidMount() {
        request.getMeMemberPrices()
            .then(res => this.setState({ summary: res.price }))
            .catch(err => {
                this.props.goBack()
                this.props.setMessageBar(true, MessageBarType.error, err)
            })
            .finally(() => this.setState({ isLoading: false }))
    }

    pay() {
        request.pay({ payment_solution: this.state.paymentKey, each: this.state.summary?.each })
            .then(res => {
                this.props.setMessageBar(true, MessageBarType.success, 'Votre paiement a bien été pris en compte.')
                this.props.setMembers(res)
                this.props.goNext()
            })
            .catch(err => {
                this.setState({ isLoading: false, errorField: err?.form?.children })
                this.props.setMessageBar(true, MessageBarType.error, err)
            })
    }

    render() {
        const { summary, isLoading, paymentKey } = this.state
        const { param } = this.props

        if (isLoading) return <Loader />

        return (
            <section id="members-me-paypal">
                <div className="card">
                    <Text variant="large" block><Icon iconName='PaymentCard' /> Paiement</Text>
                    <Divider />
                    <MessageBar messageBarType={MessageBarType.warning} isMultiline={true} >
                        Attention, veuillez vérifier que tous les membres de votre famille ont bien été ajoutées et leurs documents sont complétés.<br />
                        Pour ajouter un nouveau membre, cliquez sur le bouton "Ajouter un membre" en haut de l'écran. Pour revenir en arrière, appuyant sur le bouton "Retour" en bas de l'écran.
                </MessageBar>
                    <br />
                    <Text variant="large" block><Icon iconName='NumberedList' /> Détails du paiement (des membres non payés)</Text>
                    <Divider />
                    <Table>
                        <thead>
                            <tr>
                                <th>Licencié(s)</th>
                                <th>À payer</th>
                                {paymentKey === 3 && <th>Montant payé en bon</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {summary?.each?.map((el, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{el.name}</td>
                                        <td>{el.price} €</td>
                                        {
                                            paymentKey === 3 &&
                                            <td className="flex-row flex-start">
                                                <MaskedTextField
                                                    id="price_other"
                                                    value={summary[i]?.price_other}
                                                    onBlur={ev => {
                                                        let members = [...summary.each]
                                                        let member = { ...members[i] }
                                                        member.price_other = isNaN(parseInt(ev.target.value)) ? 0 : parseInt(ev.target.value)
                                                        members[i] = member
                                                        this.setState({ summary: { ...summary, each: members } })
                                                    }}
                                                    mask="99"
                                                    errorMessage={this.state.errorField?.amount_payed_other?.errors?.[0]}
                                                    suffix="€"
                                                    styles={{ root: { maxWidth: '100px' } }}
                                                    onKeyPress={ev => {
                                                        ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                            ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                            ev.preventDefault()
                                                    }}
                                                />
                                                <TooltipHost
                                                    content={<>Le montant doit respecter les conditions générales d'utilisations trouvable <a href="https://thouarehbc.fr/actualites/news/licences-sportives-2019-2020-partenariat-super-u-thouare-sur-loire/" target="_blank" rel="noopener noreferrer">ici</a></>}
                                                    directionalHint={DirectionalHint.bottomCenter}
                                                    delay={TooltipDelay.zero}
                                                >
                                                    <Icon iconName="Info" style={{ margin: '5px 0 0 5px' }} />
                                                </TooltipHost>
                                            </td>
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                        {paymentKey === 3 &&
                            <tfoot>
                                <tr>
                                    <th>RESTE A PAYER</th>
                                    <th>{(summary.total - (summary?.each?.map(x => x.price_other)?.reduce((a, b) => a + b) || 0))} €</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        }
                        <tfoot>
                            <tr>
                                <th>TOTAL</th>
                                <th>{summary.total} €</th>
                                {paymentKey === 3 && <th>{summary?.each?.map(x => x.price_other)?.reduce((a, b) => a + b) || 0} €</th>}
                            </tr>
                        </tfoot>
                    </Table>
                    <br />
                    <Text variant="large" block><Icon iconName='CheckMark' /> Choisissez votre mode de paiement</Text>
                    <Divider />
                    <ChoiceGroup
                        options={param?.price?.payment_solution.map(x => { return { key: x.id, text: x.label, iconProps: { iconName: x.icon } } })}
                        selectedKey={paymentKey}
                        onChange={(ev, option) => this.setState({ paymentKey: option.key })}
                    />
                    {paymentKey === 3 && <span className="has-text-danger">Veuillez préciser les montant des bons attribués à chaque membre dans le tableau ci dessus.</span>}
                    {
                        paymentKey &&
                        <>
                            <br /><br />
                            <Text variant="large" block><Icon iconName='Processing' /> Procédez au paiement</Text>
                            <Divider />

                            {
                                (() => {
                                    switch (paymentKey) {
                                        case 1:
                                            return (
                                                <>
                                                    <Text>
                                                        En appuyant sur le bouton suivant, je reconnais la véracité des informations saisie et m'engage à déposer mon paiement dans les plus bref délais.<br />
                                                        Attention, après le payement vous ne pourrez plus modifier les informations saisis !<br />
                                                        L'inscription ne sera <b>pas considérée comme valide tant que le paiement n'aura pas été validé</b>, et <b>il ne sera pas possible pour le licencié de participer aux entraînements et aux matchs</b>.
                                                </Text>
                                                    <br />
                                                    <br />
                                                    <PrimaryButton
                                                        text="Paypal"
                                                        iconProps={{ iconName: param?.price?.payment_solution.find(x => x.id === paymentKey)?.icon }}
                                                        styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                        onClick={() => this.pay()}
                                                        disabled={true}
                                                    />
                                                </>
                                            )
                                        case 2:
                                            return (
                                                <>
                                                    <Text>
                                                        Veuillez déposer votre chèque à l'ordre du THBC d'un montant de <b>{summary.total} €</b> dans la boite aux lettres du club, près du parking de la salle de sport à l'adresse :<br />
                                                        <b>
                                                            Parc des Sports<br />
                                                            Route de la Barre<br />
                                                            Thouaré-sur-Loire 44470
                                                    </b>
                                                    </Text>
                                                    <br /><br />
                                                    <Text>
                                                        En appuyant sur le bouton suivant, je reconnais la véracité des informations saisie et m'engage à déposer mon paiement dans les plus bref délais.<br />
                                                        Attention, après le payement vous ne pourrez plus modifier les informations saisis !<br />
                                                        L'inscription ne sera <b>pas considérée comme valide tant que le paiement n'aura pas été validé</b>, et <b>il ne sera pas possible pour le licencié de participer aux entraînements et aux matchs</b>.
                                                </Text>
                                                    <br />
                                                    <br />
                                                    <PrimaryButton
                                                        text="Je valide"
                                                        iconProps={{ iconName: param?.price?.payment_solution.find(x => x.id === paymentKey)?.icon }}
                                                        styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                        onClick={() => this.pay()}
                                                    />
                                                </>
                                            )
                                        case 3:
                                            return (
                                                <>
                                                    <Text>
                                                        Veuillez déposer votre chèque à l'ordre du THBC d'un montant de <b>{(summary.total - (summary?.each?.map(x => x.price_other)?.reduce((a, b) => a + b) || 0))} €</b> et le(s) coupon(s) dans la boite aux lettres du club, près du parking de la salle de sport à l'adresse :<br />
                                                        <b>
                                                            Parc des Sports<br />
                                                            Route de la Barre<br />
                                                            Thouaré-sur-Loire 44470
                                                    </b>
                                                    </Text>
                                                    <br /><br />
                                                    <Text>
                                                        En appuyant sur le bouton suivant, je reconnais la véracité des informations saisie et m'engage à déposer mon paiement dans les plus bref délais.<br />
                                                        Attention, après le payement vous ne pourrez plus modifier les informations saisis !<br />
                                                        L'inscription ne sera <b>pas considérée comme valide tant que le paiement n'aura pas été validé</b>, et <b>il ne sera pas possible pour le licencié de participer aux entraînements et aux matchs</b>.
                                                </Text>
                                                    <br />
                                                    <br />
                                                    <PrimaryButton
                                                        text="Je valide"
                                                        iconProps={{ iconName: param?.price?.payment_solution.find(x => x.id === paymentKey)?.icon }}
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