import React from 'react'
import { Separator, Text, MessageBarType, DefaultButton, PrimaryButton, ChoiceGroup } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../../redux/actions/common'
import { editMember } from '../../../redux/actions/member'
import request from '../../../helper/request'
import { Table } from 'react-bulma-components'
import Loader from '../../../component/loader'

class _MembersMePayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: [],
            isLoading: true,
            options: [
                {
                    key: 'paypal',
                    iconProps: { iconName: 'PaymentCard' },
                    text: 'Paypal',
                    infos: 'Ce choix vous permet de payer grâce à votre carte bancaire via Paypal'
                },
                {
                    key: 'cheque',
                    iconProps: { iconName: 'Document' },
                    text: 'Chèque',
                    infos: 'Ce choix vous permet de payer via un chèque que vous devrez déposer dans la boite au lettre du club situer au gymnase de Thouaré sur Loire'
                },
                {
                    key: 'cheque_and_coupons',
                    iconProps: { iconName: 'DocumentSet' },
                    text: 'Chèque & coupon(s)',
                    infos: 'Ce choix vous permet de payer via un chèque accompagné de coupon(s) de réduction, que vous devrez déposer dans la boite au lettre du club situer au gymnase de Thouaré sur Loire'
                }
            ],
            optionSelectedKey: ''
        }
    }

    componentDidMount() {
        request.getMeMemberPrices()
            .then(res => this.setState({ summary: res.price }))
            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue lors du calcul du montant.'))
            .finally(() => this.setState({ isLoading: false }))
    }

    render() {
        console.log(this.state.options)
        const { summary, isLoading } = this.state
        const { readOnly, param, members } = this.props

        if (isLoading) return <Loader />

        return (
            <section id="members-me-paypal">
                <Text variant="large" block>Paiement</Text>
                <Separator />
                <Text className="has-text-justified" block>text</Text>
                <br />
                <Text variant="large" block>Détails du paiement</Text>
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
                    options={this.state.options}
                    selectedKey={this.state.optionSelectedKey}
                    onChange={(ev, option) => this.setState({ optionSelectedKey: option.key })}
                />
                <Text>{this.state.options.find(x => x.key === this.state.optionSelectedKey)?.infos}</Text>
                <br /><br />
                <Text variant="large" block>Procédez au paiement</Text>
                <Separator />
                <br />
                <p>dqsdqsd</p>

                <br />
                <div className="flex-row flex-space-between">
                    <DefaultButton
                        text="Retour"
                        iconProps={{ iconName: 'Previous' }}
                        onClick={() => this.props.goBack()}
                    />
                    <PrimaryButton
                        text="Payer"
                        iconProps={{ iconName: 'Next' }}
                        styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                        onClick={() => this.props.goNext()}
                    />
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
const MembersMePayment = connect(mapStateToProps, mapDispatchToProps)(_MembersMePayment)
export default MembersMePayment
