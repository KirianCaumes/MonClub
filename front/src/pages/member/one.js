import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, Separator, MessageBarType, Text, MaskedTextField, Dropdown } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import request from '../../helper/request'
import Workflow from '../../component/workflow'
import withSimpleLoading from '../../helper/hoc/withSimpleLoading'

class _MemberOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data ?? {} },
            errorField: {}
        }

        this.choice = [
            { key: 'true', text: 'Oui' },
            { key: 'false', text: 'Non' },
        ]
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Membres', key: 'members' },
            { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
            { text: `${this.props.match?.params?.id ? ((this.props.data?.firstname ?? '') + ' ' + (this.props.data?.lastname ?? '')) : 'Nouveau'}`, key: 'member', isCurrentItem: true },
        ])

        const commandRead = [
            {
                key: 'editItem',
                text: 'Modifier',
                iconProps: { iconName: 'Edit' },
                onClick: () => this.setState({ readOnly: !this.state.readOnly }, () => this.props.setCommand(commandEdit))
            }
        ]

        const commandEdit = [
            {
                key: 'cancel',
                text: 'Annuler',
                iconProps: { iconName: 'Cancel' },
                onClick: () => this.setState({ readOnly: !this.state.readOnly }, () => this.props.setCommand(commandRead)),
                disabled: !this.props.match?.params?.id
            },
            {
                key: 'saveItem',
                text: 'Enregistrer',
                iconProps: { iconName: 'Save' },
                onClick: () => {
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        this.props.setCommand(commandRead)
                        if (!!this.props.match?.params?.id) {
                            request.editMember(this.props.match?.params?.id, { ...this.state.data })
                                .then(data => this.setState({ data }, () => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été modifiée.')
                                    this.props.setBreadcrumb([
                                        { text: 'Membres', key: 'members' },
                                        { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
                                        { text: `${this.props.match?.params?.id ? (this.props.data?.firstname ?? '' + this.props.data?.lastname ?? '') : 'Nouveau'}`, key: 'member', isCurrentItem: true },
                                    ])
                                }))
                                .catch(err => {
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        } else {
                            request.createMember({ ...this.state.data })
                                .then(data => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été créée.')
                                    history.push(`/equipe/${data.id}`)
                                })
                                .catch(err => {
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        }
                    })
                }
            },
            {
                key: 'deleteItem',
                text: 'Supprimer',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        request.deleteMember(this.props.match?.params?.id)
                            .then(() => {
                                this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimée.')
                                history.push('/membres')
                            })
                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                            .finally(() => this.setState({ isLoading: false }))
                    })
                },
                disabled: !this.props.match?.params?.id
            },
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    render() {
        const { readOnly, data, isLoading } = this.state

        return withSimpleLoading(isLoading,
            <section id="member-one">
                <div className="card" >
                    <Workflow member={data} />
                    <br />
                    <Text variant="large" block>Informations générales</Text>
                    <Separator />
                    <br />
                    <Columns>
                        <Columns.Column>
                            <Label required>Prénom</Label>
                            <TextField
                                value={data?.firstname ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, firstname: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.firstname?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Nom</Label>
                            <TextField
                                value={data?.lastname ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, lastname: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.lastname?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Date de naissance</Label>
                            <MaskedTextField
                                value={data?.birthdate ? (new Date(data.birthdate)).toLocaleString().slice(0, 10) : ''}
                                mask={"99/99/9999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                onBlur={ev => this.setState({ data: { ...this.state.data, birthdate: ev.target.value } })}
                                errorMessage={this.state.errorField?.birthdate?.errors?.[0]}
                            />
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label>Profession</Label>
                            <TextField
                                value={data?.profession ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, profession: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.profession?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Email</Label>
                            <TextField
                                value={data?.email ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, email: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.email?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Numéro de téléphone</Label>
                            <MaskedTextField
                                value={data?.phone_number ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, phone_number: ev.target.value } })}                                
                                mask={"9999999999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.phone_number?.errors?.[0]}
                            />
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label required>Réduction étudiant/chomeur</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_reduced_price?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_reduced_price?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_reduced_price?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_reduced_price?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_reduced_price: item.key } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Demande de transfert</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_transfer_needed?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_transfer_needed?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_transfer_needed?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_transfer_needed?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_transfer_needed: item.key } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Montant payé</Label>
                            <TextField
                                value={data?.amount_payed ?? ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label>Utilisateur associé</Label>
                            <TextField
                                value={data?.user?.username ?? ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Date d'inscription</Label>
                            <TextField
                                value={data?.creation_datetime ? (new Date(data.creation_datetime)).toLocaleString('fr-FR') : ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>

                        <Columns.Column>
                        </Columns.Column>
                    </Columns>

                    <br />

                    <Columns>
                        <Columns.Column>
                            <Text variant="large" block>Parent 1</Text>
                            <Separator />
                            <br />
                            <Columns>
                                <Columns.Column>
                                    <Label required>Prénom</Label>
                                    <TextField
                                        value={data?.parent_one_firstname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_firstname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_firstname?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label required>Nom</Label>
                                    <TextField
                                        value={data?.parent_one_lastname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_lastname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_lastname?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label required>Email</Label>
                                    <TextField
                                        value={data?.parent_one_email ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_email: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_email?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label required>Numéro de téléphone</Label>
                                    <TextField
                                        value={data?.parent_one_phone_number ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_phone_number: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_phone_number?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Profession</Label>
                                    <TextField
                                        value={data?.parent_one_profession ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_profession: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_profession?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                        </Columns.Column>
                        {/* <Separator vertical /> */}
                        <Columns.Column>
                            <Text variant="large" block>Parent 2</Text>
                            <Separator />
                            <br />
                            <Columns>
                                <Columns.Column>
                                    <Label>Prénom</Label>
                                    <TextField
                                        value={data?.parent_two_firstname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_firstname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_firstname?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label>Nom</Label>
                                    <TextField
                                        value={data?.parent_two_lastname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_lastname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_lastname?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Email</Label>
                                    <TextField
                                        value={data?.parent_two_email ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_email: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_email?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label>Numéro de téléphone</Label>
                                    <TextField
                                        value={data?.parent_two_phone_number ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_phone_number: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_phone_number?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Profession</Label>
                                    <TextField
                                        value={data?.parent_two_profession ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_profession: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_profession?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                        </Columns.Column>
                    </Columns>
                    <br />
                    <Text variant="large" block>Choix et autorisation</Text>
                    <Separator />
                    <br />
                    <Columns>
                        <Columns.Column>
                            <Label required>Autorisation évacuation</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_evacuation_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_evacuation_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_evacuation_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_evacuation_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_evacuation_allow: item.key } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Autorisation transport</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_transport_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_transport_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_transport_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_transport_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_transport_allow: item.key } })}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Autorisation utilisation image</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_image_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_image_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_image_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_image_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_image_allow: item.key } })}
                                    />
                            }
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label required>Autorisation retour maison</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_return_home_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_return_home_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_return_home_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_return_home_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_return_home_allow: item.key } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Autorisation newsletter</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_newsletter_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_newsletter_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_newsletter_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_newsletter_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_newsletter_allow: item.key } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Règlement intérieur accepté</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_accepted?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_accepted?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_accepted?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_accepted?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_accepted: item.key } })}
                                    />
                            }
                        </Columns.Column>
                    </Columns>
                    <br />
                    <Text variant="large" block>Avancement</Text>
                    <Separator />
                    <br />
                    <Columns>
                        <Columns.Column>
                            <Label required>Document(s) complété(s)</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_document_complete?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_document_complete?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_document_complete?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_document_complete?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_document_complete: item.key } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Payé</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_payed?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_payed?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_payed?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_payed?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_payed: item.key } })}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Gest'hand</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_check_gest_hand?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_check_gest_hand?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_check_gest_hand?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_check_gest_hand?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_check_gest_hand: item.key } })}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Inscription terminée</Label>
                            {
                                readOnly ?
                                    <TextField
                                        value={this.choice.find(x => x.key === data?.is_inscription_done?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_inscription_done?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_inscription_done?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_inscription_done?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_inscription_done: item.key } })}
                                    />
                            }
                        </Columns.Column>
                    </Columns>
                    <br/>
                </div>
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: data => dispatch(setBreadcrumb(data)),
        setCommand: data => dispatch(setCommand(data)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        param: state.user.param
    }
}
const MemberOne = connect(mapStateToProps, mapDispatchToProps)(_MemberOne)
export default MemberOne
