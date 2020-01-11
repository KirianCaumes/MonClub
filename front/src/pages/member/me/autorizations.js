import React from 'react'
import { Separator, Label, Text, ChoiceGroup, Link, TextField, Checkbox, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { isMajor } from 'helper/date'
import { editMember } from 'redux/actions/member'

class _MembersMeAutorizations extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { memberIndex, errorField, readOnly } = this.props
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-autorizations">
                <Text variant="large" block><Icon iconName='AccountManagement'/> Autorisations {!isMajor(member?.birthdate) ? 'parentales' : ''} THBC et règlement interieur</Text>
                <Separator />
                {
                    isMajor(member?.birthdate)
                        ?
                        <>
                            <Label required>Autorisation d'évacuation et de soin</Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "J'autorise l'équipe d'encadrement du THOUARE HANDBALL CLUB à me faire prodiguer les premiers soins et, le cas échéant, à me faire transporter au centre hospitalier de leur choix",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: "Je n'autorise pas l'équipe d'encadrement du THOUARE HANDBALL CLUB à me faire prodiguer les premiers soins et, le cas échéant, à me faire transporter au centre hospitalier de leur choix",
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_evacuation_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_evacuation_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_evacuation_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Autorisation de transport</Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "Je m'engage à ne pas intervenir juridiquement contre le THOUARE HANDBALL CLUB en cas d'accident de la route lors des déplacements effectués dans un véhicule qui n'est pas le mien.",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: "Dans le cas contraire, je m'engage à utiliser mon propre véhicule à chaque déplacement",
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_transport_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_transport_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_transport_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Droit à l'image</Label>
                            <Text className="has-text-justified" block>Le THOUARE HANDBALL CLUB peut être amené, dans le cadre strict de son développement, à utiliser des photographies et/ou des vidéos, prises à l'occasion des manifestations qu'il organise ou auxquelles il participe. Photographie et vidéo présentant plus de trois personnes identifiables.</Text>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "J'autorise le THBC à utiliser mon image dans le cadre défini ci-dessus",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: "Je n'autorise pas le THBC à utiliser mon image dans le cadre défini ci-dessus",
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_image_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_image_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_image_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Newsletter</Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: <>J'autorise le THBC à utiliser mes adresses mails afin de m'envoyer des newsletters via le site <Link target="_blank" href="https://thouarehbc.fr">thouarehbc.fr</Link> (désinscription possible à tous moments)</>,
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: <>Je n'autorise pas le THBC à utiliser mes adresses mails afin de m'envoyer des newsletters via le site <Link target="_blank" href="https://thouarehbc.fr">thouarehbc.fr</Link></>,
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_newsletter_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_newsletter_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_newsletter_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Reglement interieur <span className="is-light">à consulter sur le site <Link target="_blank" href="https://thouarehbc.fr/le-club/reglement-interieur/">thouarehbc.fr/le-club/reglement-interieur/</Link></span></Label>
                            <Checkbox
                                label="Je reconnais avoir pris connaissance du règlement intérieur du THBC et je m'engage à en respecter les conditions"                    
                                defaultChecked={member?.is_accepted}
                                onChange={(ev, isChecked) => this.props.editMember({ is_accepted: isChecked }, memberIndex)}
                                disabled={readOnly}
                            />
                            <TextField errorMessage={errorField?.is_accepted?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                        </>
                        :
                        <>
                            <Label required>Autorisation d'évacuation et de soin</Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "J'autorise l'équipe d'encadrement du THOUARE HANDBALL CLUB à faire prodiguer les premiers soins à mon enfant et, le cas échéant, à le faire transporter au centre hospitalier de leur choix.",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: <>Je n'autorise pas l'équipe d'encadrement du THOUARE HANDBALL CLUB à faire prodiguer les premiers soins à mon enfant et, le cas échéant, à le faire transporter au centre hospitalier de leur choix. <b>Je serai donc présent lors de chaque match et de chaque entraînement auquel mon enfant participera.</b></>,
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_evacuation_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_evacuation_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_evacuation_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Autorisation de transport <span className="is-light">(réhausseur obligatoire jusqu'au -10ans inclus)</span></Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "J'autorise mon enfant à emprunter les moyens de transport mis à sa disposition par le club. Je m'engage à ne pas intervenir juridiquement contre le THOUARE HANDBALL CLUB en cas d'accident.",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: <>Je n'autorise pas mon enfant à emprunter les moyens de transport mis à sa disposition par le club. <b>Je m'engage doncà l'accompagner moi-même à chaque déplacement.</b></>,
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_transport_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_transport_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_transport_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Autorisation de retour au dommicile</Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "J'autorise mon enfant à rentrer par ses propres moyens après un entrainement ou un match.",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: <>Je n'autorise pas mon enfant à rentrer par ses propres moyens après un entrainement ou un match. <b>Je m'engage donc à venir le chercher dans le gymnase aux horaires de fin d'entraînement ou de match.</b></>,
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_return_home_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_return_home_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_return_home_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <Text className="is-bold">En dehors des horaires d'entrainement ou de match, l'enfant est sous la responsabilité des parents</Text>
                            <br /><br />
                            <Label required>Droit à l'image</Label>
                            <Text className="has-text-justified" block>Le THOUARE HANDBALL CLUB peut être amené, dans le cadre strict de son développement, à utiliser des photographies et/ou des vidéos, prises à l'occasion des manifestations qu'il organise ou auxquelles il participe. Photographie et vidéo présentant plus de trois personnes identifiables.</Text>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: "J'autorise le THBC à utiliser mon image dans le cadre défini ci-dessus",
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: "Je n'autorise pas le THBC à utiliser mon image dans le cadre défini ci-dessus",
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_image_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_image_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_image_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Newsletter</Label>
                            <ChoiceGroup
                                options={[
                                    {
                                        key: 'true',
                                        text: <>J'autorise le THBC à utiliser mes adresses mails afin de m'envoyer des newsletters via le site <Link target="_blank" href="https://thouarehbc.fr">thouarehbc.fr</Link> (désinscription possible à tous moments)</>,
                                        disabled: readOnly
                                    },
                                    {
                                        key: 'false',
                                        text: <>Je n'autorise pas le THBC à utiliser mes adresses mails afin de m'envoyer des newsletters via le site <Link target="_blank" href="https://thouarehbc.fr">thouarehbc.fr</Link></>,
                                        disabled: readOnly
                                    }
                                ]}
                                selectedKey={JSON.stringify(member?.is_newsletter_allow)}
                                onChange={(ev, option) => this.props.editMember({ is_newsletter_allow: JSON.parse(option.key) }, memberIndex)}
                            />
                            <TextField errorMessage={errorField?.is_newsletter_allow?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
                            <br />
                            <Label required>Reglement interieur <span className="is-light">à consulter sur le site <Link target="_blank" href="https://thouarehbc.fr/le-club/reglement-interieur/">thouarehbc.fr/le-club/reglement-interieur/</Link></span></Label>
                            <Checkbox
                                label="Je reconnais avoir pris connaissance du règlement intérieur du THBC et je m'engage à en respecter les conditions"                    
                                defaultChecked={member?.is_accepted}
                                onChange={(ev, isChecked) => this.props.editMember({ is_accepted: isChecked }, memberIndex)}
                                disabled={readOnly}
                            />
                            <TextField errorMessage={errorField?.is_accepted?.errors?.[0]} styles={{ wrapper: { display: 'none' } }} />
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
const MembersMeAutorizations = connect(mapStateToProps, mapDispatchToProps)(_MembersMeAutorizations)
export default MembersMeAutorizations
