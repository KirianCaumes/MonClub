import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, Separator, MessageBarType, Text, MaskedTextField, Dropdown, Link } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import request from '../../helper/request'
import Workflow from '../../component/workflow'
import { stringToCleanString, stringToDate, isMajor } from '../../helper/date'
import Loader from '../../component/loader'
import FileInput from '../../component/fileInput'
import { dlBlob } from '../../helper/dlBlob'

class _MemberOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data?.member ?? {} },
            workflow: [...props?.data?.workflow ?? []],
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
            { text: `${this.props.match?.params?.id ? ((this.state.data?.firstname ?? '') + ' ' + (this.state.data?.lastname ?? '')) : 'Nouveau'}`, key: 'member', isCurrentItem: true },
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
                        this.props.setCommand([])
                        if (!!this.props.match?.params?.id) {
                            request.editMemberAdmin(this.props.match?.params?.id, { ...this.state.data })
                                .then(res => this.setState({ data: res.member, workflow: res.workflow, errorField: {} }, () => {
                                    this.props.setCommand(commandRead)
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été modifiée.')
                                    this.props.setBreadcrumb([
                                        { text: 'Membres', key: 'members' },
                                        { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
                                        { text: `${this.props.match?.params?.id ? ((this.state.data?.firstname ?? '') + ' ' + (this.state.data?.lastname ?? '')) : 'Nouveau'}`, key: 'member', isCurrentItem: true },
                                    ])
                                }))
                                .catch(err => {
                                    this.props.setCommand(commandEdit)
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        } else {
                            request.createMemberAdmin({ ...this.state.data })
                                .then(data => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été créée.')
                                    history.push(`/membre/${data.id}`)
                                })
                                .catch(err => {
                                    this.props.setCommand(commandEdit)
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
                    this.props.setCommand([])
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        request.deleteMember(this.props.match?.params?.id)
                            .then(() => {
                                this.props.setCommand(commandRead)
                                this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimée.')
                                history.push('/membres')
                            })
                            .catch(err => {
                                this.props.setCommand(commandEdit)
                                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                            })
                            .finally(() => this.setState({ isLoading: false }))
                    })
                },
                disabled: !this.props.match?.params?.id
            },
            {
                key: 'validateItem',
                text: 'Valider le workflow',
                iconProps: { iconName: 'CheckMark' },
                onClick: () => this.setState({ isLoading: true, data: { ...this.state.data, is_document_complete: true, is_payed: true, is_check_gest_hand: true, is_inscription_done: true } },
                    () => { commandEdit.find(x => x.key === "saveItem").onClick() }),
                disabled: this.state.data.is_document_complete && this.state.data.is_payed && this.state.data.is_check_gest_hand && this.state.data.is_inscription_done
            }
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    render() {
        const { readOnly, data, isLoading, workflow } = this.state

        if (isLoading) return <Loader />

        return (
            <section id="member-one">
                <div className="card" >
                    {
                        this.props.match?.params?.id &&
                        <>
                            <Workflow data={workflow} />
                            {
                                !readOnly &&
                                <Columns>
                                    <Columns.Column />
                                    <Columns.Column>
                                        <Dropdown
                                            selectedKey={data?.is_document_complete?.toString() ?? 'false'}
                                            options={this.choice}
                                            errorMessage={this.state.errorField?.is_document_complete?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_document_complete: JSON.parse(item.key) } })}
                                        />
                                    </Columns.Column>

                                    <Columns.Column>
                                        <Dropdown
                                            selectedKey={data?.is_payed?.toString() ?? 'false'}
                                            options={this.choice}
                                            errorMessage={this.state.errorField?.is_payed?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_payed: JSON.parse(item.key) } })}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Dropdown
                                            selectedKey={data?.is_check_gest_hand?.toString() ?? 'false'}
                                            options={this.choice}
                                            errorMessage={this.state.errorField?.is_check_gest_hand?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_check_gest_hand: JSON.parse(item.key) } })}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Dropdown
                                            selectedKey={data?.is_inscription_done?.toString() ?? 'false'}
                                            options={this.choice}
                                            errorMessage={this.state.errorField?.is_inscription_done?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_inscription_done: JSON.parse(item.key) } })}
                                        />
                                    </Columns.Column>
                                </Columns>
                            }
                            <br />
                        </>
                    }

                    <Text variant="large" block>Informations générales</Text>
                    <Separator />
                    <Columns>
                        <Columns.Column>
                            <Label required>Prénom</Label>
                            <TextField
                                defaultValue={data?.firstname ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, firstname: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.firstname?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Nom</Label>
                            <TextField
                                defaultValue={data?.lastname ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, lastname: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.lastname?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Date de naissance</Label>
                            <MaskedTextField
                                value={stringToCleanString(data?.birthdate)}
                                mask={"99/99/9999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                onBlur={ev => this.setState({ data: { ...this.state.data, birthdate: stringToDate(ev.target.value) } })}
                                errorMessage={this.state.errorField?.birthdate?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label>Profession</Label>
                            <TextField
                                defaultValue={data?.profession ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, profession: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.profession?.errors?.[0]}
                            />
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label required={isMajor(data?.birthdate)}>Email</Label>
                            <TextField
                                defaultValue={data?.email ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, email: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.email?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label required={isMajor(data?.birthdate)}>Numéro de téléphone</Label>
                            <MaskedTextField
                                value={data?.phone_number ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, phone_number: ev.target.value } })}
                                mask={"9999999999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.phone_number?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column />
                        <Columns.Column />
                    </Columns>
                    <Columns>
                        <Columns.Column>
                            <Label required>Code postal</Label>
                            <MaskedTextField
                                value={data?.postal_code ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, postal_code: ev.target.value } })}
                                mask={"99999"}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.postal_code?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Rue</Label>
                            <TextField
                                defaultValue={data?.street ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, street: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.street?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Ville</Label>
                            <TextField
                                defaultValue={data?.city ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, city: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.city?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column />
                    </Columns>

                    <Columns>
                        <Columns.Column size="one-quarter">
                            <Label>Équipe(s)</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={data?.teams.map(team => team.label)?.join(', ')}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.teams?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        multiSelect
                                        selectedKeys={data?.teams?.map(x => x.id ?? x.key)}
                                        options={[...this.props.param?.teams]?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                        errorMessage={this.state.errorField?.teams?.errors?.[0]}
                                        onChange={(ev, item) => {
                                            const newSelectedItems = [...data.teams]
                                            if (item.selected) {
                                                newSelectedItems.push(item)
                                            } else {
                                                const currIndex = newSelectedItems.findIndex(x => ((x.key === item.key) || (x.key === item.id) || (x.id === item.key)))
                                                if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                            }
                                            this.setState({ data: { ...this.state.data, teams: newSelectedItems } })
                                        }}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Demande réduction</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_reduced_price?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_reduced_price?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_reduced_price?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_reduced_price?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_reduced_price: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Demande transfert</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_transfer_needed?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_transfer_needed?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_transfer_needed?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_transfer_needed?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_transfer_needed: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label>Montant payé</Label>
                            <TextField
                                defaultValue={!isNaN(data?.amount_payed) ? (data?.amount_payed ?? '') : ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, amount_payed: parseFloat(ev.target.value?.replace(',', '.')) } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.amount_payed?.errors?.[0]}
                                suffix="€"
                                onKeyPress={ev => {
                                    ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                        ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                        ev.preventDefault()
                                }}
                            />
                        </Columns.Column>
                    </Columns>
                    <Columns>
                        <Columns.Column>
                            <Label disabled={!readOnly}>Utilisateur associé</Label>
                            <Link className="link-as-input" onClick={() => history.push(`/utilisateur/${data?.user?.id}`)}>
                                {data?.user?.username ?? ''}
                            </Link>
                        </Columns.Column>

                        <Columns.Column>
                            <Label disabled={!readOnly}>Date d'inscription</Label>
                            <TextField
                                defaultValue={data?.creation_datetime ? (new Date(data.creation_datetime)).toLocaleString('fr-FR') : ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        <Columns.Column />
                        <Columns.Column />
                    </Columns>
                    {
                        !isMajor(data?.birthdate) &&
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
                                                defaultValue={data?.parent_one_firstname ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_firstname: ev.target.value } })}
                                                borderless={readOnly}
                                                readOnly={readOnly}
                                                errorMessage={this.state.errorField?.parent_one_firstname?.errors?.[0]}
                                            />
                                        </Columns.Column>
                                        <Columns.Column>
                                            <Label required>Nom</Label>
                                            <TextField
                                                defaultValue={data?.parent_one_lastname ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_lastname: ev.target.value } })}
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
                                                defaultValue={data?.parent_one_email ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_email: ev.target.value } })}
                                                borderless={readOnly}
                                                readOnly={readOnly}
                                                errorMessage={this.state.errorField?.parent_one_email?.errors?.[0]}
                                            />
                                        </Columns.Column>
                                        <Columns.Column>
                                            <Label required>Numéro de téléphone</Label>
                                            <MaskedTextField
                                                value={data?.parent_one_phone_number ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_phone_number: ev.target.value } })}
                                                mask={"9999999999"}
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
                                                defaultValue={data?.parent_one_profession ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_profession: ev.target.value } })}
                                                borderless={readOnly}
                                                readOnly={readOnly}
                                                errorMessage={this.state.errorField?.parent_one_profession?.errors?.[0]}
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
                                                defaultValue={data?.parent_two_firstname ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_firstname: ev.target.value } })}
                                                borderless={readOnly}
                                                readOnly={readOnly}
                                                errorMessage={this.state.errorField?.parent_two_firstname?.errors?.[0]}
                                            />
                                        </Columns.Column>
                                        <Columns.Column>
                                            <Label>Nom</Label>
                                            <TextField
                                                defaultValue={data?.parent_two_lastname ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_lastname: ev.target.value } })}
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
                                                defaultValue={data?.parent_two_email ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_email: ev.target.value } })}
                                                borderless={readOnly}
                                                readOnly={readOnly}
                                                errorMessage={this.state.errorField?.parent_two_email?.errors?.[0]}
                                            />
                                        </Columns.Column>
                                        <Columns.Column>
                                            <Label>Numéro de téléphone</Label>
                                            <MaskedTextField
                                                value={data?.parent_two_phone_number ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_phone_number: ev.target.value } })}
                                                mask={"9999999999"}
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
                                                defaultValue={data?.parent_two_profession ?? ''}
                                                onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_profession: ev.target.value } })}
                                                borderless={readOnly}
                                                readOnly={readOnly}
                                                errorMessage={this.state.errorField?.parent_two_profession?.errors?.[0]}
                                            />
                                        </Columns.Column>
                                        <Columns.Column />
                                    </Columns>
                                </Columns.Column>
                            </Columns>
                        </>
                    }

                    <br />
                    <Text variant="large" block>Choix et autorisation</Text>
                    <Separator />
                    <Columns>
                        <Columns.Column>
                            <Label required>Autorisation évacuation</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_evacuation_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_evacuation_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_evacuation_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_evacuation_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_evacuation_allow: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Autorisation transport</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_transport_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_transport_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_transport_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_transport_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_transport_allow: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label required>Autorisation utilisation image</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_image_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_image_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_image_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_image_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_image_allow: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>

                        <Columns.Column>
                            <Label required>Règlement intérieur accepté</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_accepted?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_accepted?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_accepted?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_accepted?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_accepted: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label required>Autorisation newsletter</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.is_newsletter_allow?.toString())?.text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_newsletter_allow?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.is_newsletter_allow?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.is_newsletter_allow?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_newsletter_allow: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            {
                                !isMajor(data?.birthdate) &&
                                <>
                                    <Label required>Autorisation retour maison</Label>
                                    {
                                        readOnly ?
                                            <TextField
                                                defaultValue={this.choice.find(x => x.key === data?.is_return_home_allow?.toString())?.text ?? ''}
                                                borderless={true}
                                                readOnly={true}
                                                errorMessage={this.state.errorField?.is_return_home_allow?.errors?.[0]}
                                            />
                                            :
                                            <Dropdown
                                                defaultSelectedKey={data?.is_return_home_allow?.toString() ?? 'false'}
                                                options={this.choice}
                                                errorMessage={this.state.errorField?.is_return_home_allow?.errors?.[0]}
                                                onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_return_home_allow: JSON.parse(item.key) } })}
                                            />
                                    }
                                </>
                            }
                        </Columns.Column>

                        <Columns.Column />
                        <Columns.Column />
                    </Columns>
                    <br />
                    <Text variant="large" block>Document(s)</Text>
                    <Separator />
                    <Columns>
                        <Columns.Column>
                            <Label required>Certificat médical</Label>
                            <FileInput
                                read={readOnly}
                                errorMessage={this.state.errorField?.documentFile1?.errors?.[0]}
                                isFile={data?.documents?.find(doc => doc?.category?.id === 1)?.document}
                                fileName={data?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name}
                                onDownload={() => {
                                    return request.getDocument(this.props.match?.params?.id, 1)
                                        .then(file => dlBlob(file, data?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                }}
                                onUpload={file => {
                                    return request.uploadDocument(file, this.props.match?.params?.id, 1)
                                        .then(doc => {
                                            let documents = [...data.documents]
                                            documents.push(doc)
                                            this.setState({ data: { ...this.state.data, documents: documents } })
                                        })
                                        .catch(err => {
                                            this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                            this.setState({ errorField: { ...this.state.errorField, documentFile1: err?.form?.children?.documentFile } }, () => setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50))
                                        })
                                }}
                                onDelete={() => {
                                    return request.deleteDocument(this.props.match?.params?.id, 1)
                                        .then(() => {
                                            let documents = [...data.documents]
                                            const currIndex = documents?.findIndex(doc => doc?.category?.id === 1)
                                            if (currIndex > -1) documents.splice(currIndex, 1)
                                            this.setState({ data: { ...this.state.data, documents: documents } })
                                        })
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                }}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Attestation</Label>
                            <FileInput
                                read={true}
                                isFile={readOnly}
                                onDownload={() => {
                                    return request.getAttestation(this.props.match?.params?.id)
                                        .then(file => dlBlob(file, `${data?.firstname?.charAt(0).toUpperCase()}${data?.firstname?.slice(1)}_${data?.lastname.toUpperCase()}_2020-2021.pdf`))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                }}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            {
                                data?.is_reduced_price &&
                                <>
                                    <Label required>Jusitificatif étudiant/chomage</Label>
                                    <FileInput
                                        read={readOnly}
                                        errorMessage={this.state.errorField?.documentFile2?.errors?.[0]}
                                        isFile={data?.documents?.find(doc => doc?.category?.id === 2)?.document}
                                        fileName={data?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name}
                                        onDownload={() => {
                                            return request.getDocument(this.props.match?.params?.id, 2)
                                                .then(file => dlBlob(file, data?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                                .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                        }}
                                        onUpload={file => {
                                            return request.uploadDocument(file, this.props.match?.params?.id, 2)
                                                .then(doc => {
                                                    let documents = [...data.documents]
                                                    documents.push(doc)
                                                    this.setState({ data: { ...this.state.data, documents: documents } })
                                                })
                                                .catch(err => {
                                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                                    this.setState({ errorField: { ...this.state.errorField, documentFile2: err?.form?.children?.documentFile } }, () => setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50))
                                                })
                                        }}
                                        onDelete={() => {
                                            return request.deleteDocument(this.props.match?.params?.id, 2)
                                                .then(() => {
                                                    let documents = [...data.documents]
                                                    const currIndex = documents?.findIndex(doc => doc?.category?.id === 2)
                                                    if (currIndex > -1) documents.splice(currIndex, 1)
                                                    this.setState({ data: { ...this.state.data, documents: documents } })
                                                })
                                                .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                        }}
                                    />
                                </>
                            }
                        </Columns.Column>
                        <Columns.Column />
                    </Columns>

                    <br />
                    <Text variant="large" block>Autre</Text>
                    <Separator />
                    <Columns>
                        <Columns.Column>
                            <Label>Notes</Label>
                            <TextField
                                readOnly={readOnly}
                                borderless={readOnly}
                                multiline
                                autoAdjustHeight
                                defaultValue={data?.notes ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, notes: ev.target.value } })}
                                errorMessage={this.state.errorField?.notes?.errors?.[0]}
                            />
                        </Columns.Column>
                    </Columns>
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
