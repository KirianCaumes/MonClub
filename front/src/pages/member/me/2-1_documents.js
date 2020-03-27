import React from 'react'
import { Text, Icon, Checkbox } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { editMember } from 'redux/actions/member'
import Divider from 'component/divider'
import Emoji from 'component/emoji'

class _MembersMeDocumentsToUpload extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            errorDocument: {}
        }
    }

    render() {
        const { memberIndex, readOnly } = this.props
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-documents-upload">
                <Text variant="large" block><Icon iconName='FabricUserFolder' /> Les documents requis</Text>
                <Divider />
                {
                    member?.is_reduced_price &&
                    <>
                        <Text className="has-text-danger">
                            <Emoji symbol="⚠️" label="warning" />
                            Vous avez indiqué vouloir une réduction étudiant/chomage, veuillez nous fournir un document attestant de cela.
                        </Text>
                        <br />
                    </>
                }
                <Text className="has-text-danger">
                    <Emoji symbol="⚠️" label="warning" />
                    La FFHB impose au club de posséder l'<b>original du certificat médical</b>.
                </Text>
                <br />
                {
                    member?.is_license_renewal &&
                    <>
                        <br />
                        <Checkbox
                            label={'Mon certificat de la saison précédente a moins de 3 ans et j\'ai répondu "non" à chacune des rubriques du questionnaire, il est donc toujours valable (cocher si oui)'}
                            defaultChecked={member?.is_certificate_old}
                            onChange={(ev, isChecked) => this.props.editMember({ is_certificate_old: isChecked }, memberIndex)}
                            disabled={readOnly}
                        />
                    </>
                }
                <br />
                {
                    member?.is_certificate_old &&
                    <>
                        <Text className="has-text-success"><b>Vous n'avez pas besoin de renouveller votre certificat médical</b> (le club vérifiera tout même la bonne validité du certificat)</Text>
                        <br />
                    </>
                }
                {
                    (!member?.is_certificate_old || member?.is_reduced_price) &&
                    <Text>
                        Pour valider votre inscription vous devrez donc <b>déposer vos documents dans la boite au lettre du club</b> :<br />
                        <b>
                            Parc des Sports<br />
                            Route de la Barre<br />
                            Thouaré-sur-Loire 44470
                        </b>
                    </Text>
                }
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
        members: state.member.members,
        param: state.user.param
    }
}
const MembersMeDocumentsToUpload = connect(mapStateToProps, mapDispatchToProps)(_MembersMeDocumentsToUpload)
export default MembersMeDocumentsToUpload
