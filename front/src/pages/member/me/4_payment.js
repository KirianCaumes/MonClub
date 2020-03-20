import React from 'react'
import { Text, MessageBarType, DefaultButton, PrimaryButton, ChoiceGroup, MessageBar, Icon, MaskedTextField, Separator, TooltipHost, DirectionalHint, TooltipDelay, Label } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { editMember, setMembers } from 'redux/actions/member'
import request from 'helper/request'
import { Table } from 'react-bulma-components'
import Loader from 'component/loader'
import Divider from 'component/divider'
import { PayPalButton } from "react-paypal-button-v2"
import Emoji from 'component/emoji'
import { datetimeToString } from 'helper/date'

class _MembersMePayment extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            summary: {},
            isLoading: true,
            isPaypalButtonLoading: true,
            paymentKey: null
        }
    }

    componentDidMount() {
        this.props.setCommand([])
        this.fetchGetMeMemberPrices = request.getMeMemberPrices()
        this.fetchGetMeMemberPrices
            .fetch()
            .then(res => this.setState({ summary: res.price }))
            .catch(err => {
                this.props.goBack()
                this.props.setMessageBar(true, MessageBarType.error, err)
            })
            .finally(() => {
                this.setState({ isLoading: false })
                this.props.setCommand(this.props.command) //Re set commandbar
            })
    }

    componentWillUnmount() {
        if (this.fetchGetMeMemberPrices) this.fetchGetMeMemberPrices.cancel()
        if (this.fetchPay) this.fetchPay.cancel()
    }

    pay(paypalInfos = null) {
        let serializedPaypalInfos = { //Simply serialize data to be handled easly in PHP
            id_payment: paypalInfos?.details?.purchase_units?.[0].payments?.captures?.[0]?.id,
            creation_datetime: paypalInfos && datetimeToString(paypalInfos?.details?.purchase_units?.[0].payments?.captures?.[0]?.update_time),
            amount: paypalInfos?.details?.purchase_units?.[0].payments?.captures?.[0]?.amount?.value,
            currency: paypalInfos?.details?.purchase_units?.[0].payments?.captures?.[0]?.amount?.currency_code,
            email: paypalInfos?.details?.payer?.email_address,
            country: paypalInfos?.details?.payer?.address?.country_code,
            firstname: paypalInfos?.details?.payer?.name?.given_name,
            lastname: paypalInfos?.details?.payer?.name?.surname,
            data: JSON.stringify(paypalInfos)
        }

        this.props.setCommand([])
        this.setState({ isLoading: true }, () => {
            this.fetchPay = request.pay({
                payment_solution: this.state.paymentKey,
                each: this.state.summary?.each,              //Use for paymentKey 3 "cheque et coupons"
                paypalInfos: serializedPaypalInfos           //Use for paymentKey 1 "paypal"   
            })
            this.fetchPay
                .fetch()
                .then(res => {
                    this.props.setMessageBar(true, MessageBarType.success, 'Votre paiement a bien été pris en compte.')
                    this.props.setMembers(res)
                    this.props.goNext()
                })
                .catch(err => {
                    this.setState({ isLoading: false, errorField: err?.form?.children })
                    this.props.setMessageBar(true, MessageBarType.error, err)
                    this.props.setCommand(this.props.command) //Re set commandbar
                })
        })
    }

    render() {
        const { summary, isLoading, paymentKey, isPaypalButtonLoading } = this.state
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
                                <th><Label>Licencié(s)</Label></th>
                                <th><Label>À payer</Label></th>
                                {paymentKey === 3 && <th><Label>Montant payé en bon</Label></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {summary?.each?.map((el, i) => {
                                return (
                                    <tr key={i}>
                                        <td><Text>{el.name}</Text></td>
                                        <td><Text>{el.price} €</Text></td>
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
                                                    <Icon iconName="Info" style={{ margin: '5px 0 0 5px' }} className="icon-info-label" />
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
                                    <th><Label>RESTE A PAYER</Label></th>
                                    <th><Label>{(summary.total - (summary?.each?.map(x => x.price_other)?.reduce((a, b) => a + b) || 0))} €</Label></th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        }
                        <tfoot>
                            <tr>
                                <th><Label>TOTAL</Label></th>
                                <th><Label>{paymentKey === 1 ? (summary.total + param?.price?.global?.paypal_fee) : summary.total} €</Label></th>
                                {paymentKey === 3 && <th><Label>{summary?.each?.map(x => x.price_other)?.reduce((a, b) => a + b) || 0} €</Label></th>}
                            </tr>
                        </tfoot>
                        {paymentKey === 1 &&
                            <tfoot>
                                <tr>
                                    <th><Label>Frais PayPal</Label></th>
                                    <th><Label>{param?.price?.global?.paypal_fee} €</Label></th>
                                </tr>
                            </tfoot>
                        }
                    </Table>
                    <br />
                    <Text variant="large" block><Icon iconName='CheckMark' /> Choisissez votre mode de paiement</Text>
                    <Divider />
                    <ChoiceGroup
                        options={param?.price?.payment_solution.map(x => { return { key: x.id, text: x.label, iconProps: { iconName: x.icon } } })}
                        selectedKey={paymentKey}
                        onChange={(ev, option) => this.setState({ paymentKey: option.key })}
                    />
                    {paymentKey === 3 && <Text className="has-text-danger">Veuillez préciser les montant des bons attribués à chaque membre dans le tableau ci dessus.</Text>}
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
                                                    <Text className="has-text-danger">
                                                        <Emoji symbol="⚠️" label="warning" />
                                                        Le THBC se réserve le droit de ne pas valider l'inscription d'un nouvel adhérent au club si aucune équipe n'est en mesure d'accueillir la personne. Dans ce cas exceptionnel, un remboursement total de la somme payée sera effectué.
                                                    </Text>
                                                    <br />
                                                    <br />
                                                    <div style={{ width: '300px' }}>
                                                        {isPaypalButtonLoading && <Loader color="#2B6CA3" />}
                                                        <PayPalButton
                                                            style={{
                                                                layout: 'vertical',
                                                                color: 'white',
                                                                shape: 'rect',
                                                                label: 'pay',
                                                                // tagline: 'false'
                                                            }}
                                                            options={{
                                                                clientId: "AdsT-hu8QLr0cOBxKYnFhbYnriqnwf8v58eSNZoTrbs0Tn1w2dbEUZBGJ_IWdyJjm5PmbOQVbzigVZIr",
                                                                currency: "EUR"
                                                            }}
                                                            amount={(summary?.total ?? 0) + param?.price?.global?.paypal_fee}
                                                            shippingPreference="NO_SHIPPING"
                                                            onSuccess={(details, data) => {
                                                                return this.pay({ details, data })
                                                            }}
                                                            onButtonReady={() => this.setState({ isPaypalButtonLoading: false })}
                                                            catchError={err => this.props.setMessageBar(true, MessageBarType.error, 'Une erreur est survenue.')}
                                                            onError={err => this.props.setMessageBar(true, MessageBarType.error, 'Une erreur est survenue.')}
                                                        />
                                                    </div>
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
                                                    <Text className="has-text-danger">
                                                        <Emoji symbol="⚠️" label="warning" />
                                                        Le THBC se réserve le droit de ne pas valider l'inscription d'un nouvel adhérent au club si aucune équipe n'est en mesure d'accueillir la personne. Dans ce cas exceptionnel, un remboursement total de la somme payée sera effectué.
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
                                                    <Text className="has-text-danger">
                                                        <Emoji symbol="⚠️" label="warning" />
                                                        Le THBC se réserve le droit de ne pas valider l'inscription d'un nouvel adhérent au club si aucune équipe n'est en mesure d'accueillir la personne. Dans ce cas exceptionnel, un remboursement total de la somme payée sera effectué.
                                                    </Text>
                                                    <br />
                                                    <br />
                                                    <PrimaryButton
                                                        text="Je valide"
                                                        iconProps={{ iconName: param?.price?.payment_solution.find(x => x.id === paymentKey)?.icon }}
                                                        styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                        onClick={() => this.pay()}
                                                        disabled={!summary?.each?.map(x => x.price_other)?.reduce((a, b) => a + b)}
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
