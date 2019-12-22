import React from 'react'
import { Separator, DefaultButton, Label, Text, PrimaryButton, ChoiceGroup, Link, MessageBarType, Checkbox } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../../redux/actions/common'
import { isMajor } from '../../../helper/date'
import Loader from '../../../component/loader'
import { Columns } from 'react-bulma-components'
import FileInput from '../../../component/fileInput'
import request from '../../../helper/request'
import { dlBlob } from '../../../helper/dlBlob'

class _MembersMePayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            readOnly: false,
            member: { ...props?.member ?? {} },
            errorField: {}
        }

        this.choice = [
            { key: 'true', text: 'Oui' },
            { key: 'false', text: 'Non' },
        ]
    }

    render() {
        const { isLoading, member, readOnly } = this.state

        if (isLoading) return <Loader />

        return (
            <section id="members-me-autorizations">
                <Text variant="large" block>Le paiement</Text>
                <Separator />
                <br />
                <div className="flex-row flex-space-between">
                    <DefaultButton
                        text="Retourner aux documents"
                        iconProps={{ iconName: 'Previous' }}
                        onClick={() => this.props.goBack()}
                    />
                    <PrimaryButton
                        text="Valider le paiement"
                        iconProps={{ iconName: 'Next' }}
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
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        param: state.user.param
    }
}
const MembersMePayment = connect(mapStateToProps, mapDispatchToProps)(_MembersMePayment)
export default MembersMePayment
