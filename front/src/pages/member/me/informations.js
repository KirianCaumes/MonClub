import React from 'react'
import { Columns } from 'react-bulma-components'
import { Separator, TextField, Label, Text, MaskedTextField, Checkbox, MessageBar, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../../redux/actions/common'
import { stringToCleanString, stringToDate, isMajor } from '../../../helper/date'
import { editMember } from '../../../redux/actions/member'

class _MembersMeInformations extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { memberIndex, errorField, readOnly } = this.props
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-informations">
                <Text variant="large" block>Informations concernant le licencié</Text>
                <Separator />
                <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} >
                    Avant toute opérations sur MonClub, veuillez finaliser votre inscription Gest'Hand.
                </MessageBar>
                <br />
                <Columns>
                    <Columns.Column>
                        <Label required>Prénom</Label>
                        <TextField
                            defaultValue={member?.firstname ?? ''}
                            onBlur={ev => this.props.editMember({ firstname: ev.target.value }, memberIndex)}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.firstname?.errors?.[0]}
                        />
                    </Columns.Column>

                    <Columns.Column>
                        <Label required>Nom</Label>
                        <TextField
                            defaultValue={member?.lastname ?? ''}
                            onBlur={ev => this.props.editMember({ lastname: ev.target.value }, memberIndex)}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.lastname?.errors?.[0]}
                        />
                    </Columns.Column>
                    <Columns.Column>
                        <Label required>Date de naissance</Label>
                        <MaskedTextField
                            value={stringToCleanString(member?.birthdate)}
                            mask={"99/99/9999"}
                            borderless={readOnly}
                            readOnly={readOnly}
                            onBlur={ev => this.props.editMember({ birthdate: stringToDate(ev.target.value) }, memberIndex)}
                            errorMessage={errorField?.birthdate?.errors?.[0]}
                        />
                    </Columns.Column>
                    <Columns.Column>
                        <Label>Profession</Label>
                        <TextField
                            defaultValue={member?.profession ?? ''}
                            onBlur={ev => this.props.editMember({ profession: ev.target.value }, memberIndex)}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.profession?.errors?.[0]}
                        />
                    </Columns.Column>
                </Columns>

                <Columns>
                    <Columns.Column>
                        <Label required={isMajor(member?.birthdate)}>Email</Label>
                        <TextField
                            defaultValue={member?.email ?? ''}
                            onBlur={ev => this.props.editMember({ email: ev.target.value }, memberIndex)}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.email?.errors?.[0]}
                        />
                    </Columns.Column>

                    <Columns.Column>
                        <Label required={isMajor(member?.birthdate)}>Numéro de téléphone</Label>
                        <MaskedTextField
                            value={member?.phone_number ?? ''}
                            onBlur={ev => this.props.editMember({ phone_number: ev.target.value }, memberIndex)}
                            mask={"9999999999"}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.phone_number?.errors?.[0]}
                        />
                    </Columns.Column>
                    <Columns.Column />
                    <Columns.Column />
                </Columns>
                <Columns>
                    <Columns.Column>
                        <Label required>Code postal</Label>
                        <MaskedTextField
                            value={member?.postal_code ?? ''}
                            onBlur={ev => this.props.editMember({ postal_code: ev.target.value }, memberIndex)}
                            mask={"99999"}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.postal_code?.errors?.[0]}
                        />
                    </Columns.Column>
                    <Columns.Column>
                        <Label required>Rue</Label>
                        <TextField
                            defaultValue={member?.street ?? ''}
                            onBlur={ev => this.props.editMember({ street: ev.target.value }, memberIndex)}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.street?.errors?.[0]}
                        />
                    </Columns.Column>
                    <Columns.Column>
                        <Label required>Ville</Label>
                        <TextField
                            defaultValue={member?.city ?? ''}
                            onBlur={ev => this.props.editMember({ city: ev.target.value }, memberIndex)}
                            borderless={readOnly}
                            readOnly={readOnly}
                            errorMessage={errorField?.city?.errors?.[0]}
                        />
                    </Columns.Column>
                    <Columns.Column />
                </Columns>
                <Checkbox
                    label="Demande de transfert de club (cocher si oui)"
                    defaultChecked={member?.is_transfer_needed}
                    onChange={(ev, isChecked) => this.props.editMember({ is_transfer_needed: isChecked }, memberIndex)}
                    disabled={readOnly}
                />
                <br />
                {
                    isMajor(member?.birthdate) &&
                    <>
                        <Checkbox
                            label="Demande réduction chomeur ou étudiant (cocher si oui)"
                            defaultChecked={member?.is_reduced_price}
                            onChange={(ev, isChecked) => this.props.editMember({ is_reduced_price: isChecked }, memberIndex)}
                            disabled={readOnly || member?.is_non_competitive}
                        />
                        <br />
                    </>
                }
                {
                    isMajor(member?.birthdate) &&
                    <>
                        <Checkbox
                            label="Je souhaite jouer uniquement en loisirs et ainsi bénéficier d'une réduction (cocher si oui)"
                            defaultChecked={member?.is_non_competitive}
                            onChange={(ev, isChecked) => this.props.editMember({ is_non_competitive: isChecked }, memberIndex)}
                            disabled={readOnly || member?.is_reduced_price}
                        />
                        <br />
                    </>
                }
                {
                    !isMajor(member?.birthdate) &&
                    <>
                        <br />
                        <Columns>
                            <Columns.Column>
                                <Text variant="large" block>Parent 1</Text>
                                <Separator />
                                <Columns>
                                    <Columns.Column>
                                        <Label required>Prénom</Label>
                                        <TextField
                                            defaultValue={member?.parent_one_firstname ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_one_firstname: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_one_firstname?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label required>Nom</Label>
                                        <TextField
                                            defaultValue={member?.parent_one_lastname ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_one_lastname: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_one_lastname?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                </Columns>
                                <Columns>
                                    <Columns.Column>
                                        <Label required>Email</Label>
                                        <TextField
                                            defaultValue={member?.parent_one_email ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_one_email: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_one_email?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label required>Numéro de téléphone</Label>
                                        <MaskedTextField
                                            value={member?.parent_one_phone_number ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_one_phone_number: ev.target.value }, memberIndex)}
                                            mask={"9999999999"}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_one_phone_number?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                </Columns>
                                <Columns>
                                    <Columns.Column>
                                        <Label>Profession</Label>
                                        <TextField
                                            defaultValue={member?.parent_one_profession ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_one_profession: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_one_profession?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                    <Columns.Column />
                                </Columns>
                            </Columns.Column>
                            {/* <Separator vertical /> */}
                            <Columns.Column>
                                <Text variant="large" block>Parent 2</Text>
                                <Separator />
                                <Columns>
                                    <Columns.Column>
                                        <Label>Prénom</Label>
                                        <TextField
                                            defaultValue={member?.parent_two_firstname ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_two_firstname: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_two_firstname?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label>Nom</Label>
                                        <TextField
                                            defaultValue={member?.parent_two_lastname ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_two_lastname: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_two_lastname?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                </Columns>
                                <Columns>
                                    <Columns.Column>
                                        <Label>Email</Label>
                                        <TextField
                                            defaultValue={member?.parent_two_email ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_two_email: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_two_email?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label>Numéro de téléphone</Label>
                                        <MaskedTextField
                                            value={member?.parent_two_phone_number ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_two_phone_number: ev.target.value }, memberIndex)}
                                            mask={"9999999999"}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_two_phone_number?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                </Columns>
                                <Columns>
                                    <Columns.Column>
                                        <Label>Profession</Label>
                                        <TextField
                                            defaultValue={member?.parent_two_profession ?? ''}
                                            onBlur={ev => this.props.editMember({ parent_two_profession: ev.target.value }, memberIndex)}
                                            borderless={readOnly}
                                            readOnly={readOnly}
                                            errorMessage={errorField?.parent_two_profession?.errors?.[0]}
                                        />
                                    </Columns.Column>
                                    <Columns.Column />
                                </Columns>
                            </Columns.Column>
                        </Columns>
                    </>
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
        members: state.member.members
    }
}
const MembersMeInformations = connect(mapStateToProps, mapDispatchToProps)(_MembersMeInformations)
export default MembersMeInformations
