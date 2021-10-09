import React from 'react'
import { Columns } from 'react-bulma-components'
import { TextField, Label, Text, MaskedTextField, Checkbox, TooltipHost, DirectionalHint, TooltipDelay, Dropdown, Icon, Separator, MessageBar, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { stringToCleanString, stringToDate, isMajor } from 'helper/date'
import { editMember } from 'redux/actions/member'
import Divider from 'component/divider'
import Emoji from 'component/emoji'

class _MembersMeInformations extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { memberIndex, errorField, readOnly } = this.props
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-informations">
                <div className="card">
                    {
                        !member.is_payed && !member.is_inscription_done &&
                        <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} >
                            Avant toute opérations sur MonClub, veuillez finaliser votre inscription Gest'Hand.
                        </MessageBar>
                    }
                    {
                        member.is_payed && !member.is_inscription_done &&
                        <MessageBar messageBarType={MessageBarType.success} isMultiline={false} >
                            Le paiement de ce membre à déjà été effectué et son inscription est en attente de validation par le club.
                        </MessageBar>
                    }
                    {
                        member.is_payed && member.is_inscription_done &&
                        <MessageBar messageBarType={MessageBarType.success} isMultiline={false} >
                            L'inscription de ce membre à été validée par le club.
                        </MessageBar>
                    }

                    <br />
                    <Text variant="large" block><Icon iconName='ContactCard' /> Vos informations</Text>
                    <Divider />
                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="firstname">Prénom</Label>
                            <TextField
                                id="firstname"
                                placeholder="Prénom"
                                defaultValue={member?.firstname ?? ''}
                                onBlur={ev => this.props.editMember({ firstname: ev.target.value }, memberIndex)}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.firstname?.errors?.[0]}
                            />
                            <br />
                            <Label required htmlFor="lastname">Nom</Label>
                            <TextField
                                id="lastname"
                                placeholder="Nom"
                                defaultValue={member?.lastname ?? ''}
                                onBlur={ev => this.props.editMember({ lastname: ev.target.value }, memberIndex)}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.lastname?.errors?.[0]}
                            />
                            <br />
                            <div className="flex-row flex-start">
                                <Label required htmlFor="birthdate">Date de naissance</Label>
                                <TooltipHost
                                    content="Format attendu: JJ/MM/AAAA"
                                    directionalHint={DirectionalHint.bottomCenter}
                                    delay={TooltipDelay.zero}
                                >
                                    <Icon iconName="Info" className="icon-info-label is-required" />
                                </TooltipHost>
                            </div>
                            <MaskedTextField
                                id="birthdate"
                                placeholder="Date de naissance"
                                value={stringToCleanString(member?.birthdate)}
                                mask={"99/99/9999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                onBlur={ev => this.props.editMember({ birthdate: stringToDate(ev.target.value) }, memberIndex)}
                                errorMessage={errorField?.birthdate?.errors?.[0]}
                            />
                            <br />
                            <Label required htmlFor="sex">Sexe</Label>
                            {
                                readOnly ?
                                    <TextField
                                        id="sex"
                                        placeholder="Sexe"
                                        defaultValue={member?.sex?.label}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={errorField?.sex?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        id="sex"
                                        placeholder="Sexe"
                                        selectedKey={member?.sex?.id}
                                        options={[...this.props?.param?.sexes]?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                        errorMessage={errorField?.sex?.errors?.[0]}
                                        onChange={(ev, item) => this.props.editMember({ sex: item }, memberIndex)}
                                    />
                            }
                        </Columns.Column>
                        <Separator vertical className="is-hidden-mobile" />
                        <Separator className=" is-hidden-desktop " />
                        <Columns.Column className="has-text-justified">
                            <Text>
                                Pourquoi nous indiquer qui vos informations ? <Emoji symbol="🤔" label="thinking" /><br /><br />
                                Vous êtes unique, et c’est pour cela que le  <b className="is-italic">club</b> souhaite savoir ces quelques informations de base pour vous identifier parmi les tous les membres du club. <Emoji symbol="🏅" label="medal" /><br /><br />
                                Grâce à votre date de naissance et votre sexe, le  <b className="is-italic">club</b> sera en mesure de vous attribuer à une équipe où vous serez capable de vous épanouir, progresser et surtout, de vous amuser ! <Emoji symbol="🤾‍♀️" label="handball" /><br /><br />
                                Vos données sont soumises aux lois du RGPD (protection et droit des données), ainsi toutes informations sont sécurisées, privées et vous pouvez faire une demande d’anonymisation à tout moment. <Emoji symbol="🛡️" label="shield" />
                            </Text>
                        </Columns.Column>
                    </Columns>
                </div>
                <br />
                <div className="card">
                    <Text variant="large" block><Icon iconName='ContactInfo' /> Vos moyens de contacts</Text>
                    <Divider />

                    <Columns>
                        <Columns.Column>
                            <Label required={isMajor(member?.birthdate)} htmlFor="email">Email</Label>
                            <TextField
                                id="email"
                                placeholder="Email"
                                defaultValue={member?.email ?? ''}
                                onBlur={ev => this.props.editMember({ email: ev.target.value }, memberIndex)}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.email?.errors?.[0]}
                            />
                            <br />
                            <div className="flex-row flex-start">
                                <Label required={isMajor(member?.birthdate)} htmlFor="phone_number">Numéro de téléphone</Label>
                                <TooltipHost
                                    content="Exemple de format attendu: 0123456789"
                                    directionalHint={DirectionalHint.bottomCenter}
                                    delay={TooltipDelay.zero}
                                >
                                    <Icon iconName="Info" className={`icon-info-label ${isMajor(member?.birthdate) ? 'is-required' : 'is-not-required'}`} />
                                </TooltipHost>
                            </div>
                            <MaskedTextField
                                id="phone_number"
                                placeholder="Numéro de téléphone"
                                value={member?.phone_number ?? ''}
                                onBlur={ev => this.props.editMember({ phone_number: !isNaN(ev.target.value) ? ev.target.value : null }, memberIndex)}
                                mask={"9999999999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.phone_number?.errors?.[0]}
                            />
                            <br />
                            <Label htmlFor="profession">Profession</Label>
                            <TextField
                                id="profession"
                                placeholder="Profession"
                                defaultValue={member?.profession ?? ''}
                                onBlur={ev => this.props.editMember({ profession: ev.target.value }, memberIndex)}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.profession?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Separator vertical className="is-hidden-mobile" />
                        <Separator className=" is-hidden-desktop " />
                        <Columns.Column className="has-text-justified">
                            <Text>
                                Que ce soit pour vous communiquer des informations relatives au club, de vous joindre en cas d’urgence ou de simplement échanger, le  <b className="is-italic">club</b> souhaite connaître votre e-mail et votre numéro de téléphone. <Emoji symbol="📇" label="contact" /><br /><br />
                                Ces informations sont bien évidemment confidentielles et ne seront pas utilisées à d’autres fins que celles du club. <Emoji symbol="🔐" label="locker" /><br /><br />
                                Renseigner votre profession (facultatif) permet au club de mieux vous connaître et de, pourquoi pas, vous solliciter sur des compétences que vous possédez, si vous désirez participer ponctuellement au bon fonctionnement du club. <Emoji symbol="🤾" label="handball" />
                            </Text>
                        </Columns.Column>
                    </Columns>
                </div>
                <br />
                <div className="card">

                    <Text variant="large" block><Icon iconName='CityNext' /> Votre adresse</Text>
                    <Divider />

                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="postal_code">Code postal</Label>
                            <MaskedTextField
                                id="postal_code"
                                placeholder="Code postal"
                                value={member?.postal_code ?? ''}
                                onBlur={ev => this.props.editMember({ postal_code: ev.target.value }, memberIndex)}
                                mask={"99999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.postal_code?.errors?.[0]}
                            />
                            <br />
                            <Label required htmlFor="street">Rue</Label>
                            <TextField
                                id="street"
                                placeholder="Rue"
                                defaultValue={member?.street ?? ''}
                                onBlur={ev => this.props.editMember({ street: ev.target.value }, memberIndex)}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.street?.errors?.[0]}
                            />
                            <br />
                            <Label required htmlFor="city">Ville</Label>
                            <TextField
                                id="city"
                                placeholder="Ville"
                                defaultValue={member?.city ?? ''}
                                onBlur={ev => this.props.editMember({ city: ev.target.value }, memberIndex)}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={errorField?.city?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Separator vertical className="is-hidden-mobile" />
                        <Separator className=" is-hidden-desktop " />
                        <Columns.Column className="has-text-justified">
                            <Text>
                                Dans certains cas exceptionnels, le <b className="is-italic">club</b> peut-être amené à vous envoyer un courrier. <Emoji symbol="✉️" label="envelope" /><br /><br />
                                Veuillez donc renseigner une adresse postale valide à laquelle le membre peut être joint.<Emoji symbol="🤾‍♂️" label="handball" /><br /><br />
                                Ces informations sont également confidentielles et ne seront pas utilisées à d’autres fins que celles du club. <Emoji symbol="🔐" label="locker" />

                            </Text>
                        </Columns.Column>
                    </Columns>
                </div>
                <br />

                {
                    !isMajor(member?.birthdate) &&
                    <>
                        <div className="card">
                            <Columns>
                                <Columns.Column>
                                    <Text variant="large" block><Icon iconName='ContactList' /> Parent 1</Text>
                                    <Divider />
                                    <Label required htmlFor="parent_one_firstname">Prénom</Label>
                                    <TextField
                                        id="parent_one_firstname"
                                        placeholder="Prénom"
                                        defaultValue={member?.parent_one_firstname ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_one_firstname: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_one_firstname?.errors?.[0]}
                                    />
                                    <br />
                                    <Label required htmlFor="parent_one_lastname">Nom</Label>
                                    <TextField
                                        id="parent_one_lastname"
                                        placeholder="Nom"
                                        defaultValue={member?.parent_one_lastname ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_one_lastname: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_one_lastname?.errors?.[0]}
                                    />
                                    <br />
                                    <Label required htmlFor="parent_one_email">Email</Label>
                                    <TextField
                                        id="parent_one_email"
                                        placeholder="Email"
                                        defaultValue={member?.parent_one_email ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_one_email: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_one_email?.errors?.[0]}
                                    />
                                    <br />
                                    <Label required htmlFor="parent_one_phone_number">Numéro de téléphone</Label>
                                    <MaskedTextField
                                        id="parent_one_phone_number"
                                        placeholder="Numéro de téléphone"
                                        value={member?.parent_one_phone_number ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_one_phone_number: !isNaN(ev.target.value) ? ev.target.value : null }, memberIndex)}
                                        mask={"9999999999"}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_one_phone_number?.errors?.[0]}
                                    />
                                    <br />
                                    <Label htmlFor="parent_one_profession">Profession</Label>
                                    <TextField
                                        id="parent_one_profession"
                                        placeholder="Profession"
                                        defaultValue={member?.parent_one_profession ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_one_profession: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_one_profession?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Separator vertical />
                                <Columns.Column>
                                    <Text variant="large" block><Icon iconName='ContactList' /> Parent 2</Text>
                                    <Divider />
                                    <Label htmlFor="parent_two_firstname">Prénom</Label>
                                    <TextField
                                        id="parent_two_firstname"
                                        placeholder="Prénom"
                                        defaultValue={member?.parent_two_firstname ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_two_firstname: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_two_firstname?.errors?.[0]}
                                    />
                                    <br />
                                    <Label htmlFor="parent_two_lastname">Nom</Label>
                                    <TextField
                                        id="parent_two_lastname"
                                        placeholder="Nom"
                                        defaultValue={member?.parent_two_lastname ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_two_lastname: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_two_lastname?.errors?.[0]}
                                    />
                                    <br />
                                    <Label htmlFor="parent_two_email">Email</Label>
                                    <TextField
                                        id="parent_two_email"
                                        placeholder="Email"
                                        defaultValue={member?.parent_two_email ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_two_email: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_two_email?.errors?.[0]}
                                    />
                                    <br />
                                    <Label htmlFor="parent_two_phone_number">Numéro de téléphone</Label>
                                    <MaskedTextField
                                        id="parent_two_phone_number"
                                        placeholder="Numéro de téléphone"
                                        value={member?.parent_two_phone_number ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_two_phone_number: !isNaN(ev.target.value) ? ev.target.value : null }, memberIndex)}
                                        mask={"9999999999"}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_two_phone_number?.errors?.[0]}
                                    />
                                    <br />
                                    <Label htmlFor="parent_two_profession">Profession</Label>
                                    <TextField
                                        id="parent_two_profession"
                                        placeholder="Profession"
                                        defaultValue={member?.parent_two_profession ?? ''}
                                        onBlur={ev => this.props.editMember({ parent_two_profession: ev.target.value }, memberIndex)}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={errorField?.parent_two_profession?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                        </div>
                        <br />
                    </>
                }
                <div className="card">

                    <Text variant="large" block><Icon iconName='WebAppBuilderFragment' /> Éléments complémentaires</Text>
                    <Divider />
                    <Checkbox
                        label="Demande de transfert de club (cocher si oui)"
                        defaultChecked={member?.is_transfer_needed}
                        onChange={(ev, isChecked) => this.props.editMember({ is_transfer_needed: isChecked }, memberIndex)}
                        disabled={readOnly}
                    />
                    {
                        isMajor(member?.birthdate) &&
                        <>
                            <br />
                            <Checkbox
                                label="Demande de réduction chomeur ou étudiant (cocher si oui)"
                                defaultChecked={member?.is_reduced_price}
                                onChange={(ev, isChecked) => this.props.editMember({ is_reduced_price: isChecked }, memberIndex)}
                                disabled={readOnly || member?.is_non_competitive}
                            />
                            <br />
                            <Checkbox
                                label="Je souhaite jouer uniquement en loisirs et ainsi bénéficier d'une réduction (cocher si oui)"
                                defaultChecked={member?.is_non_competitive}
                                onChange={(ev, isChecked) => this.props.editMember({ is_non_competitive: isChecked }, memberIndex)}
                                disabled={readOnly || member?.is_reduced_price}
                            />
                        </>
                    }
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
        members: state.member.members,
        param: state.user.param
    }
}
const MembersMeInformations = connect(mapStateToProps, mapDispatchToProps)(_MembersMeInformations)
export default MembersMeInformations
