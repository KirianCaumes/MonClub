import React from 'react'
import { Columns, Table } from 'react-bulma-components'
import { Label, TextField, MessageBarType, Text, MaskedTextField, Dropdown, Link, VirtualizedComboBox, TooltipHost, DirectionalHint, TooltipDelay, Icon, IconButton, DefaultButton, Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setModal } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import Workflow from 'component/workflow'
import { stringToCleanString, stringToDate, isMajor, dateToCleanDateTimeString, getAge, dateToCleanDateString, getYear } from 'helper/date'
import Loader from 'component/loader'
import FileInput from 'component/fileInput'
import { dlBlob, openBlob } from 'helper/blob'
import DropdownIcon from 'component/dropdown'
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from 'helper/constants'
import Divider from 'component/divider'

class _MemberOne extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data?.member ?? {} },
            initData: { ...props?.data?.member ?? {} },
            workflow: [...props?.data?.workflow ?? []],
            errorField: {},
            isModalNonObjectionOpen: false,
            nonObjection: {
                club: '',
                address: ''
            },
            newPriceLoading: false,
            priceLoading: false
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Membres', key: 'members' },
            { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
            { text: <span className="is-capitalized">{this.props.match?.params?.id ? ((this.state.data?.firstname ?? '') + ' ' + (this.state.data?.lastname ?? '')) : 'Nouveau'}</span>, key: 'member', isCurrentItem: true },
        ])

        const commandRead = [
            {
                key: 'editItem',
                text: 'Modifier',
                iconProps: { iconName: 'Edit' },
                onClick: () => this.setState({ readOnly: !this.state.readOnly }, () => this.props.setCommand(commandEdit)),
                disabled: !this.props.me?.roles?.includes(ROLE_ADMIN) && !this.props.me?.roles?.includes(ROLE_SUPER_ADMIN)
            }
        ]

        const commandEdit = [
            {
                key: 'cancel',
                text: 'Annuler',
                iconProps: { iconName: 'Cancel' },
                onClick: () => this.setState({ readOnly: !this.state.readOnly, data: this.state.initData }, () => this.props.setCommand(commandRead)),
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
                                .then(res => this.setState({ data: res.member, initData: res.member, workflow: res.workflow, errorField: {} }, () => {
                                    this.props.setCommand(commandRead)
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été modifiée.')
                                    this.props.setBreadcrumb([
                                        { text: 'Membres', key: 'members' },
                                        { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
                                        { text: <span className="is-capitalized">{this.props.match?.params?.id ? ((this.state.data?.firstname ?? '') + ' ' + (this.state.data?.lastname ?? '')) : 'Nouveau'}</span>, key: 'member', isCurrentItem: true },
                                    ])
                                }))
                                .catch(err => {
                                    this.props.setCommand(commandEdit)
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err)
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
                                    this.setState({ isLoading: false, readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err)
                                })
                        }
                    })
                }
            },
            {
                key: 'deleteItem',
                text: 'Supprimer',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                    this.props.setModal(
                        true,
                        'Supprimer le membre',
                        'Êtes-vous certains de vouloir supprimer le membre ? Cette action est définitive.',
                        () => {
                            this.setState({ isLoading: true, readOnly: true }, () => {
                                request.deleteMember(this.props.match?.params?.id)
                                    .then(() => {
                                        this.props.setCommand(commandRead)
                                        this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimé.')
                                        history.push('/membres')
                                    })
                                    .catch(err => {
                                        this.props.setCommand(commandEdit)
                                        this.setState({ readOnly: false, isLoading: false })
                                        this.props.setMessageBar(true, MessageBarType.error, err)
                                    })
                            })
                        }
                    )
                },
                disabled: !this.props.match?.params?.id
            },
            {
                key: 'validateItem',
                text: 'Valider le workflow',
                iconProps: { iconName: 'CheckMark' },
                onClick: () => this.setState({ isLoading: true, data: { ...this.state.data, is_document_complete: true, is_payed: true, is_check_gest_hand: true, is_inscription_done: true } }, () => { commandEdit.find(x => x.key === "saveItem").onClick() }),
                disabled: (this.state.data.is_document_complete && this.state.data.is_payed && this.state.data.is_check_gest_hand && this.state.data.is_inscription_done) || !this.props.match?.params?.id
            }
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    render() {
        const { readOnly, data, initData, isLoading, workflow, nonObjection } = this.state
        const { param } = this.props

        if (isLoading) return <Loader />

        return (
            <>
                <section id="member-one">
                    <div className="card" >
                        <div className="head">
                            <h1><Icon iconName='Contact' /> Toutes les informations sur le membre: <span className="is-capitalized">{this.props.match?.params?.id ? ((this.state.data?.firstname ?? '') + ' ' + (this.state.data?.lastname ?? '')) : 'Nouveau'}</span></h1>
                        </div>

                        <Text variant="large" block><Icon iconName='WorkFlow' /> Workflow d'avancement de l'inscription</Text>
                        <Divider />
                        <Workflow data={workflow} />
                        {
                            this.props.match?.params?.id && !readOnly &&
                            <Columns>
                                <Columns.Column className="is-hidden-mobile" />
                                <Columns.Column>
                                    <DropdownIcon
                                        icon={param?.choices.find(x => x.key === data?.is_document_complete?.toString())?.icon ?? ''}
                                        valueDisplay={param?.choices.find(x => x.key === data?.is_document_complete?.toString())?.text ?? ''}
                                        selectedKey={data?.is_document_complete?.toString() ?? 'false'}
                                        options={param?.choices}
                                        error={this.state.errorField?.is_document_complete?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_document_complete: JSON.parse(item.key) } })}
                                    />
                                </Columns.Column>

                                <Columns.Column>
                                    <DropdownIcon
                                        icon={param?.choices.find(x => x.key === data?.is_payed?.toString())?.icon ?? ''}
                                        valueDisplay={param?.choices.find(x => x.key === data?.is_payed?.toString())?.text ?? ''}
                                        selectedKey={data?.is_payed?.toString() ?? 'false'}
                                        options={param?.choices}
                                        error={this.state.errorField?.is_payed?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_payed: JSON.parse(item.key) } })}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <DropdownIcon
                                        icon={param?.choices.find(x => x.key === data?.is_check_gest_hand?.toString())?.icon ?? ''}
                                        valueDisplay={param?.choices.find(x => x.key === data?.is_check_gest_hand?.toString())?.text ?? ''}
                                        selectedKey={data?.is_check_gest_hand?.toString() ?? 'false'}
                                        options={param?.choices}
                                        error={this.state.errorField?.is_check_gest_hand?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_check_gest_hand: JSON.parse(item.key) } })}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <DropdownIcon
                                        icon={param?.choices.find(x => x.key === data?.is_inscription_done?.toString())?.icon ?? ''}
                                        valueDisplay={param?.choices.find(x => x.key === data?.is_inscription_done?.toString())?.text ?? ''}
                                        selectedKey={data?.is_inscription_done?.toString() ?? 'false'}
                                        options={param?.choices}
                                        error={this.state.errorField?.is_inscription_done?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_inscription_done: JSON.parse(item.key) } })}
                                    />
                                </Columns.Column>
                            </Columns>
                        }
                    </div>
                    <br />
                    <div className="card" >

                        <Text variant="large" block><Icon iconName='ContactInfo' /> Informations générales</Text>
                        <Divider />
                        <Columns>
                            <Columns.Column>
                                <Label required htmlFor="firstname">Prénom</Label>
                                <TextField
                                    id="firstname"
                                    placeholder="Prénom"
                                    defaultValue={data?.firstname ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, firstname: ev.target.value } })}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.firstname?.errors?.[0]}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label required htmlFor="lastname">Nom</Label>
                                <TextField
                                    id="lastname"
                                    placeholder="Nom"
                                    defaultValue={data?.lastname ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, lastname: ev.target.value } })}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.lastname?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column>
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
                                    value={stringToCleanString(data?.birthdate)}
                                    mask={"99/99/9999"}
                                    borderless={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                    readOnly={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, birthdate: stringToDate(ev.target.value) } })}
                                    errorMessage={this.state.errorField?.birthdate?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column size="one-quarter">
                                <Label required htmlFor="sex">Sexe</Label>
                                {
                                    readOnly ?
                                        <TextField
                                            id="sex"
                                            placeholder="Sexe"
                                            defaultValue={data?.sex?.label}
                                            borderless={true}
                                            readOnly={true}
                                            errorMessage={this.state.errorField?.sex?.errors?.[0]}
                                        />
                                        :
                                        <Dropdown
                                            id="sex"
                                            placeholder="Sexe"
                                            selectedKey={data?.sex?.id}
                                            options={[...this.props?.param?.sexes]?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                            errorMessage={this.state.errorField?.sex?.errors?.[0]}
                                            useComboBoxAsMenuWidth={true}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, sex: item } })}
                                        />
                                }
                            </Columns.Column>
                        </Columns>

                        <Columns>
                            <Columns.Column>
                                <Label required={isMajor(data?.birthdate)} htmlFor="email">Email</Label>
                                <TextField
                                    id="email"
                                    placeholder="Email"
                                    defaultValue={data?.email ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, email: ev.target.value } })}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.email?.errors?.[0]}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <div className="flex-row flex-start">
                                    <Label required={isMajor(data?.birthdate)} htmlFor="phone_number">Numéro de téléphone</Label>
                                    <TooltipHost
                                        content="Exemple de format attendu: 0123456789"
                                        directionalHint={DirectionalHint.bottomCenter}
                                        delay={TooltipDelay.zero}
                                    >
                                        <Icon iconName="Info" className={`icon-info-label ${isMajor(data?.birthdate) ? 'is-required' : 'is-not-required'}`} />
                                    </TooltipHost>
                                </div>
                                <MaskedTextField
                                    id="phone_number"
                                    placeholder="Numéro de téléphone"
                                    value={data?.phone_number ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, phone_number: ev.target.value } })}
                                    mask={"9999999999"}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.phone_number?.errors?.[0]}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label htmlFor="profession">Profession</Label>
                                <TextField
                                    id="profession"
                                    placeholder="Profession"
                                    defaultValue={data?.profession ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, profession: ev.target.value } })}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.profession?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column className="is-hidden-touch" />
                        </Columns>
                        <Columns>
                            <Columns.Column>
                                <Label required htmlFor="postal_code">Code postal</Label>
                                <MaskedTextField
                                    id="postal_code"
                                    placeholder="Code postal"
                                    value={data?.postal_code ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, postal_code: ev.target.value } })}
                                    mask={"99999"}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.postal_code?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <Label required htmlFor="street">Rue</Label>
                                <TextField
                                    id="street"
                                    placeholder="Rue"
                                    defaultValue={data?.street ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, street: ev.target.value } })}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.street?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <Label required htmlFor="city">Ville</Label>
                                <TextField
                                    id="city"
                                    placeholder="Ville"
                                    defaultValue={data?.city ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, city: ev.target.value } })}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    errorMessage={this.state.errorField?.city?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column className="is-hidden-touch" />
                        </Columns>

                        <Columns>
                            <Columns.Column size="one-quarter">
                                <Label htmlFor="teams">Équipe(s)</Label>
                                {
                                    readOnly ?
                                        <TextField
                                            id="teams"
                                            placeholder="Équipe(s)"
                                            defaultValue={data?.teams?.map(team => team.label)?.join(', ')}
                                            borderless={true}
                                            readOnly={true}
                                            errorMessage={this.state.errorField?.teams?.errors?.[0]}
                                        />
                                        :
                                        <VirtualizedComboBox
                                            id="teams"
                                            placeholder="Équipe(s)"
                                            multiSelect
                                            selectedKey={data?.teams?.map(x => x.id ?? x.key)}
                                            options={[...this.props.param?.teams]?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                            errorMessage={this.state.errorField?.teams?.errors?.[0]}
                                            useComboBoxAsMenuWidth={true}
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
                            <Columns.Column size="one-quarter">
                                <Label htmlFor="username">Utilisateur associé</Label>
                                {
                                    readOnly ?
                                        <Link className="link-as-input" onClick={() => history.push(`/utilisateur/${data?.user?.id}`)}>
                                            {data?.user?.username ?? ''}
                                        </Link>
                                        :
                                        <VirtualizedComboBox
                                            id="username"
                                            placeholder="Utilisateur associé"
                                            selectedKey={data?.user?.id}
                                            options={param.users?.map(x => { return { ...x, key: x.id, text: x.username } })}
                                            errorMessage={this.state.errorField?.username?.errors?.[0]}
                                            useComboBoxAsMenuWidth={true}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, user: item } })}
                                        />
                                }
                            </Columns.Column>
                            <Columns.Column size="one-quarter">
                                <Label required htmlFor="season">Saison</Label>
                                {
                                    readOnly ?
                                        <TextField
                                            id="season"
                                            placeholder="Saison"
                                            defaultValue={data?.season?.label}
                                            borderless={true}
                                            readOnly={true}
                                            errorMessage={this.state.errorField?.season?.errors?.[0]}
                                        />
                                        :
                                        <Dropdown
                                            id="season"
                                            placeholder="Saison"
                                            selectedKey={data?.season?.id}
                                            options={[...this.props.param?.season]?.filter(x => x.is_active)?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                            errorMessage={this.state.errorField?.season?.errors?.[0]}
                                            useComboBoxAsMenuWidth={true}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, season: item } })}
                                        />
                                }
                            </Columns.Column>

                            <Columns.Column>
                                <Label disabled={!readOnly} htmlFor="creation_datetime">Date d'inscription</Label>
                                <TextField
                                    id="creation_datetime"
                                    placeholder="Date d'inscription"
                                    defaultValue={dateToCleanDateTimeString(new Date(data.creation_datetime))}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                        </Columns>
                    </div>
                    <br />
                    <div className="card" >
                        <div className="flex-row flex-start ">
                            <Text variant="large" block><Icon iconName='NumberedList' /> Informations tarifaires</Text>
                            &nbsp;
                            <TooltipHost
                                content={"Voir le détail tarifaire"}
                                directionalHint={DirectionalHint.topCenter}
                                delay={TooltipDelay.zero}
                            >
                                <IconButton
                                    iconProps={{ iconName: 'RedEye' }}
                                    disabled={this.state.priceLoading}
                                    onClick={() => this.setState({ priceLoading: true },
                                        () => request.getMemberPrice(data?.id)
                                            .then(res => this.showModalDetailPrice(res.position, res.price))
                                            .catch(err => {
                                                this.setState({ price: 'Erreur' })
                                                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue lors du calcul du montant.')
                                            })
                                            .finally(() => this.setState({ priceLoading: false }))
                                    )
                                    }
                                />
                            </TooltipHost>
                        </div>
                        <Divider />


                        <Columns>
                            {
                                isMajor(data?.birthdate) &&
                                <>
                                    <Columns.Column>
                                        <Label required htmlFor="is_non_competitive">Loisir</Label>
                                        <DropdownIcon
                                            id="is_non_competitive"
                                            readOnly={readOnly || data?.is_reduced_price || (data?.is_payed ? true : initData?.is_payed)}
                                            icon={param?.choices.find(x => x.key === data?.is_non_competitive?.toString())?.icon ?? ''}
                                            valueDisplay={param?.choices.find(x => x.key === data?.is_non_competitive?.toString())?.text ?? ''}
                                            selectedKey={data?.is_non_competitive?.toString() ?? 'false'}
                                            options={param?.choices}
                                            error={this.state.errorField?.is_non_competitive?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_non_competitive: JSON.parse(item.key) } })}
                                        />
                                    </Columns.Column>

                                    <Columns.Column>
                                        <Label required htmlFor="is_reduced_price">Demande réduction</Label>
                                        <DropdownIcon
                                            id="is_reduced_price"
                                            readOnly={readOnly || data?.is_non_competitive || (data?.is_payed ? true : initData?.is_payed)}
                                            icon={param?.choices.find(x => x.key === data?.is_reduced_price?.toString())?.icon ?? ''}
                                            valueDisplay={param?.choices.find(x => x.key === data?.is_reduced_price?.toString())?.text ?? ''}
                                            selectedKey={data?.is_reduced_price?.toString() ?? 'false'}
                                            options={param?.choices}
                                            error={this.state.errorField?.is_reduced_price?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_reduced_price: JSON.parse(item.key) } })}
                                        />
                                    </Columns.Column>
                                </>
                            }

                            <Columns.Column>
                                <Label required htmlFor="is_transfer_needed">Demande transfert</Label>
                                <DropdownIcon
                                    id="is_transfer_needed"
                                    readOnly={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                    icon={param?.choices.find(x => x.key === data?.is_transfer_needed?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_transfer_needed?.toString())?.text ?? ''}
                                    selectedKey={data?.is_transfer_needed?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_transfer_needed?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_transfer_needed: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <Label required htmlFor="is_license_renewal">Renouvellement</Label>
                                <DropdownIcon
                                    id="is_license_renewal"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.is_license_renewal?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_license_renewal?.toString())?.text ?? ''}
                                    selectedKey={data?.is_license_renewal?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_license_renewal?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_license_renewal: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            {!isMajor(data?.birthdate) && <><Columns.Column className="is-hidden-touch" /> <Columns.Column className="is-hidden-touch" /></>}
                        </Columns>

                        <Columns>
                            <Columns.Column>
                                <div className="flex-row flex-start">
                                    <Label htmlFor="amount_payed">Montant payé</Label>
                                    {
                                        !readOnly && (data?.is_payed || initData?.is_payed) &&
                                        <TooltipHost
                                            content="Les champs concernant les montants et le moyen du paiement sont désactivés si le membre est déjà payé."
                                            directionalHint={DirectionalHint.bottomCenter}
                                            delay={TooltipDelay.zero}
                                        >
                                            <Icon iconName="Info" className="icon-info-label is-not-required" />
                                        </TooltipHost>
                                    }
                                </div>
                                <div className="flex-row">
                                    <TextField
                                        id="amount_payed"
                                        placeholder="Montant payé"
                                        // defaultValue={!isNaN(data?.amount_payed) ? (data?.amount_payed ?? '') : ''}
                                        value={!isNaN(data?.amount_payed) ? (data?.amount_payed ?? '') : ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, amount_payed: parseFloat(ev.target.value?.replace(',', '.')) } })}
                                        borderless={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                        readOnly={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                        errorMessage={this.state.errorField?.amount_payed?.errors?.[0]}
                                        suffix="€"
                                        onKeyPress={ev => {
                                            ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                ev.preventDefault()
                                        }}
                                        styles={{ root: { width: '100%' } }}
                                    />
                                    {
                                        !readOnly && !(data?.is_payed ? true : initData?.is_payed) &&
                                        <TooltipHost
                                            content="Recalculer le prix à payé."
                                            directionalHint={DirectionalHint.bottomCenter}
                                            delay={TooltipDelay.zero}
                                        >
                                            <IconButton
                                                iconProps={{ iconName: 'Refresh' }}
                                                disabled={this.state.newPriceLoading || !data?.id}
                                                onClick={() => this.setState({ newPriceLoading: true }, () => request.getMemberPrice(this.props.match?.params?.id)
                                                    .then(res => this.setState({ data: { ...this.state.data, amount_payed: res.price } }))
                                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue lors du calcul du montant.'))
                                                    .finally(() => this.setState({ newPriceLoading: false }))
                                                )}
                                            />
                                        </TooltipHost>
                                    }
                                </div>
                            </Columns.Column>
                            {
                                data?.payment_solution?.id === 3 &&
                                <>
                                    <Columns.Column>
                                        <div className="flex-row flex-start">
                                            <Label htmlFor="amount_payed_other">Montant autre payé</Label>
                                            <TooltipHost
                                                content="Corresponds au prix payé en coupons."
                                                directionalHint={DirectionalHint.bottomCenter}
                                                delay={TooltipDelay.zero}
                                            >
                                                <Icon iconName="Info" className="icon-info-label is-not-required" />
                                            </TooltipHost>
                                        </div>
                                        <TextField
                                            id="amount_payed_other"
                                            placeholder="Montant autre payé"
                                            defaultValue={!isNaN(data?.amount_payed_other) ? (data?.amount_payed_other ?? '') : ''}
                                            onBlur={ev => this.setState({ data: { ...this.state.data, amount_payed_other: parseFloat(ev.target.value?.replace(',', '.')) } })}
                                            borderless={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                            readOnly={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                            errorMessage={this.state.errorField?.amount_payed_other?.errors?.[0]}
                                            suffix="€"
                                            onKeyPress={ev => {
                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                    ev.preventDefault()
                                            }}
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label htmlFor="amount_real_payed">Montant réel payé</Label>
                                        <TextField
                                            id="amount_real_payed"
                                            placeholder="Montant réel payé"
                                            value={!isNaN(data?.amount_payed_other) && !isNaN(data?.amount_payed) ? (data?.amount_payed - data?.amount_payed_other) : (isNaN(data?.amount_payed_other) ? data?.amount_payed : 0)}
                                            borderless={true}
                                            readOnly={true}
                                            suffix="€"
                                        />
                                    </Columns.Column>
                                </>
                            }

                            <Columns.Column>
                                <Label htmlFor="payment_solution">Moyen de paiement</Label>
                                <DropdownIcon
                                    id="payment_solution"
                                    placeholder="Moyen de paiement"
                                    readOnly={readOnly || (data?.is_payed ? true : initData?.is_payed)}
                                    icon={data?.payment_solution?.icon}
                                    valueDisplay={data?.payment_solution?.label}
                                    selectedKey={data?.payment_solution?.id}
                                    options={[...this.props.param?.price?.payment_solution]?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                    error={this.state.errorField?.payment_solution?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, payment_solution: item } })}
                                />
                            </Columns.Column>
                            {
                                data?.payment_solution?.id !== 3 &&
                                <>
                                    <Columns.Column className="is-hidden-touch" />
                                    <Columns.Column className="is-hidden-touch" />
                                </>
                            }
                        </Columns>

                        <Columns>
                            <Columns.Column>
                                <Label htmlFor="payment_notes">Notes sur le paiement</Label>
                                <TextField
                                    id="payment_notes"
                                    placeholder="Notes sur le paiement"
                                    readOnly={readOnly}
                                    borderless={readOnly}
                                    multiline
                                    autoAdjustHeight
                                    defaultValue={data?.payment_notes ?? ''}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, payment_notes: ev.target.value } })}
                                    errorMessage={this.state.errorField?.payment_notes?.errors?.[0]}
                                />
                            </Columns.Column>
                        </Columns>
                    </div>
                    {
                        !isMajor(data?.birthdate) &&
                        <>
                            <br />
                            <div className="card" >
                                <Columns>
                                    <Columns.Column>
                                        <Text variant="large" block><Icon iconName='ContactList' /> Parent 1</Text>
                                        <Divider />
                                        <Columns>
                                            <Columns.Column>
                                                <Label required htmlFor="parent_one_firstname">Prénom</Label>
                                                <TextField
                                                    id="parent_one_firstname"
                                                    placeholder="Prénom"
                                                    defaultValue={data?.parent_one_firstname ?? ''}
                                                    onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_firstname: ev.target.value } })}
                                                    borderless={readOnly}
                                                    readOnly={readOnly}
                                                    errorMessage={this.state.errorField?.parent_one_firstname?.errors?.[0]}
                                                />
                                            </Columns.Column>
                                            <Columns.Column>
                                                <Label required htmlFor="parent_one_lastname">Nom</Label>
                                                <TextField
                                                    id="parent_one_lastname"
                                                    placeholder="Nom"
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
                                                <Label required htmlFor="parent_one_email">Email</Label>
                                                <TextField
                                                    id="parent_one_email"
                                                    placeholder="Email"
                                                    defaultValue={data?.parent_one_email ?? ''}
                                                    onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_email: ev.target.value } })}
                                                    borderless={readOnly}
                                                    readOnly={readOnly}
                                                    errorMessage={this.state.errorField?.parent_one_email?.errors?.[0]}
                                                />
                                            </Columns.Column>
                                            <Columns.Column>
                                                <Label required htmlFor="parent_one_phone_number">Numéro de téléphone</Label>
                                                <MaskedTextField
                                                    id="parent_one_phone_number"
                                                    placeholder="Numéro de téléphone"
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
                                                <Label htmlFor="parent_one_profession">Profession</Label>
                                                <TextField
                                                    id="parent_one_profession"
                                                    placeholder="Profession"
                                                    defaultValue={data?.parent_one_profession ?? ''}
                                                    onBlur={ev => this.setState({ data: { ...this.state.data, parent_one_profession: ev.target.value } })}
                                                    borderless={readOnly}
                                                    readOnly={readOnly}
                                                    errorMessage={this.state.errorField?.parent_one_profession?.errors?.[0]}
                                                />
                                            </Columns.Column>
                                            <Columns.Column className="is-hidden-touch" />
                                        </Columns>
                                    </Columns.Column>
                                    {/* <Separator vertical /> */}
                                    <Columns.Column>
                                        <Text variant="large" block><Icon iconName='ContactList' /> Parent 2</Text>
                                        <Divider />
                                        <Columns>
                                            <Columns.Column>
                                                <Label htmlFor="parent_two_firstname">Prénom</Label>
                                                <TextField
                                                    id="parent_two_firstname"
                                                    placeholder="Prénom"
                                                    defaultValue={data?.parent_two_firstname ?? ''}
                                                    onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_firstname: ev.target.value } })}
                                                    borderless={readOnly}
                                                    readOnly={readOnly}
                                                    errorMessage={this.state.errorField?.parent_two_firstname?.errors?.[0]}
                                                />
                                            </Columns.Column>
                                            <Columns.Column>
                                                <Label htmlFor="parent_two_lastname">Nom</Label>
                                                <TextField
                                                    id="parent_two_lastname"
                                                    placeholder="Nom"
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
                                                <Label htmlFor="parent_two_email">Email</Label>
                                                <TextField
                                                    id="parent_two_email"
                                                    placeholder="Email"
                                                    defaultValue={data?.parent_two_email ?? ''}
                                                    onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_email: ev.target.value } })}
                                                    borderless={readOnly}
                                                    readOnly={readOnly}
                                                    errorMessage={this.state.errorField?.parent_two_email?.errors?.[0]}
                                                />
                                            </Columns.Column>
                                            <Columns.Column>
                                                <Label htmlFor="parent_two_phone_number">Numéro de téléphone</Label>
                                                <MaskedTextField
                                                    id="parent_two_phone_number"
                                                    placeholder="Numéro de téléphone"
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
                                                <Label htmlFor="parent_two_profession">Profession</Label>
                                                <TextField
                                                    id="parent_two_profession"
                                                    placeholder="Profession"
                                                    defaultValue={data?.parent_two_profession ?? ''}
                                                    onBlur={ev => this.setState({ data: { ...this.state.data, parent_two_profession: ev.target.value } })}
                                                    borderless={readOnly}
                                                    readOnly={readOnly}
                                                    errorMessage={this.state.errorField?.parent_two_profession?.errors?.[0]}
                                                />
                                            </Columns.Column>
                                            <Columns.Column className="is-hidden-touch" />
                                        </Columns>
                                    </Columns.Column>
                                </Columns>
                            </div>
                        </>
                    }
                    <br />
                    <div className="card" >

                        <div className="flex-row flex-start ">
                            <Text variant="large" block><Icon iconName='AccountManagement' /> Choix et autorisation</Text>
                            {
                                !readOnly &&
                                <>
                                    &nbsp;
                                <TooltipHost
                                        content={"Cliquer pout tout valider"}
                                        directionalHint={DirectionalHint.topCenter}
                                        delay={TooltipDelay.zero}
                                    >
                                        <IconButton
                                            iconProps={{ iconName: 'Accept' }}
                                            onClick={() => this.setState({ data: { ...this.state.data, is_evacuation_allow: true, is_transport_allow: true, is_image_allow: true, is_accepted: true, is_newsletter_allow: true, is_return_home_allow: !isMajor(data?.birthdate) } })}
                                        />
                                    </TooltipHost>
                                </>
                            }

                        </div>
                        <Divider styles={{ root: { marginTop: !readOnly ? '-5px' : 'auto' } }} />
                        <Columns>
                            <Columns.Column>
                                <Label required htmlFor="is_evacuation_allow">Autorisation évacuation</Label>
                                <DropdownIcon
                                    id="is_evacuation_allow"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.is_evacuation_allow?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_evacuation_allow?.toString())?.text ?? ''}
                                    selectedKey={data?.is_evacuation_allow?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_evacuation_allow?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_evacuation_allow: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label required htmlFor="is_transport_allow">Autorisation transport</Label>
                                <DropdownIcon
                                    id="is_transport_allow"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.is_transport_allow?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_transport_allow?.toString())?.text ?? ''}
                                    selectedKey={data?.is_transport_allow?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_transport_allow?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_transport_allow: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <Label required htmlFor="is_image_allow">Autorisation utilisation image</Label>
                                <DropdownIcon
                                    id="is_image_allow"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.is_image_allow?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_image_allow?.toString())?.text ?? ''}
                                    selectedKey={data?.is_image_allow?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_image_allow?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_image_allow: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label required htmlFor="is_accepted">Règlement intérieur accepté</Label>
                                <DropdownIcon
                                    id="is_accepted"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.is_accepted?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_accepted?.toString())?.text ?? ''}
                                    selectedKey={data?.is_accepted?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_accepted?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_accepted: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                        </Columns>

                        <Columns>
                            <Columns.Column>
                                <Label required htmlFor="is_newsletter_allow">Autorisation newsletter</Label>
                                <DropdownIcon
                                    id="is_newsletter_allow"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.is_newsletter_allow?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.is_newsletter_allow?.toString())?.text ?? ''}
                                    selectedKey={data?.is_newsletter_allow?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.is_newsletter_allow?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_newsletter_allow: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                {
                                    !isMajor(data?.birthdate) &&
                                    <>
                                        <Label required htmlFor="is_return_home_allow">Autorisation retour maison</Label>
                                        <DropdownIcon
                                            id="is_return_home_allow"
                                            readOnly={readOnly}
                                            icon={param?.choices.find(x => x.key === data?.is_return_home_allow?.toString())?.icon ?? ''}
                                            valueDisplay={param?.choices.find(x => x.key === data?.is_return_home_allow?.toString())?.text ?? ''}
                                            selectedKey={data?.is_return_home_allow?.toString() ?? 'false'}
                                            options={param?.choices}
                                            error={this.state.errorField?.is_return_home_allow?.errors?.[0]}
                                            onChange={(ev, item) => this.setState({ data: { ...this.state.data, is_return_home_allow: JSON.parse(item.key) } })}
                                        />
                                    </>
                                }
                            </Columns.Column>

                            <Columns.Column className="is-hidden-touch" />
                            <Columns.Column className="is-hidden-touch" />
                        </Columns>
                    </div>
                    <br />
                    <div className="card" >
                        <div className="flex-row flex-start ">
                            <Text variant="large" block><Icon iconName='News' /> GestHand</Text>
                            {
                                !readOnly &&
                                <>
                                    &nbsp;
                                <TooltipHost
                                        content={"Cliquer pout tout valider"}
                                        directionalHint={DirectionalHint.topCenter}
                                        delay={TooltipDelay.zero}
                                    >
                                        <IconButton
                                            iconProps={{ iconName: 'Accept' }}
                                            onClick={() => this.setState({ data: { ...this.state.data, gesthand_is_photo: true, gesthand_is_photo_id: true, gesthand_is_certificate: true, gesthand_is_health_questionnaire: true, gesthand_is_ffhb_authorization: true } })}
                                        />
                                    </TooltipHost>
                                </>
                            }
                        </div>
                        <Divider styles={{ root: { marginTop: !readOnly ? '-5px' : 'auto' } }} />
                        <Columns>
                            <Columns.Column>
                                <Label htmlFor="gesthand_is_photo">Photo identité</Label>
                                <DropdownIcon
                                    id="gesthand_is_photo"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.gesthand_is_photo?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.gesthand_is_photo?.toString())?.text ?? ''}
                                    selectedKey={data?.gesthand_is_photo?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.gesthand_is_photo?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, gesthand_is_photo: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label htmlFor="gesthand_is_photo_id">Photo carte identité</Label>
                                <DropdownIcon
                                    id="gesthand_is_photo_id"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.gesthand_is_photo_id?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.gesthand_is_photo_id?.toString())?.text ?? ''}
                                    selectedKey={data?.gesthand_is_photo_id?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.gesthand_is_photo_id?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, gesthand_is_photo_id: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label htmlFor="gesthand_is_ffhb_authorization">Autorisarion FFHB</Label>
                                <DropdownIcon
                                    id="gesthand_is_ffhb_authorization"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.gesthand_is_ffhb_authorization?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.gesthand_is_ffhb_authorization?.toString())?.text ?? ''}
                                    selectedKey={data?.gesthand_is_ffhb_authorization?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.gesthand_is_ffhb_authorization?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, gesthand_is_ffhb_authorization: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column className="is-hidden-touch" />
                        </Columns>

                        <Columns>
                            <Columns.Column>
                                <Label htmlFor="gesthand_is_certificate">Certificat médical</Label>
                                <DropdownIcon
                                    id="gesthand_is_certificate"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.gesthand_is_certificate?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.gesthand_is_certificate?.toString())?.text ?? ''}
                                    selectedKey={data?.gesthand_is_certificate?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.gesthand_is_certificate?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, gesthand_is_certificate: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <Label htmlFor="gesthand_is_health_questionnaire">Questionnaire de santé</Label>
                                <DropdownIcon
                                    id="gesthand_is_health_questionnaire"
                                    readOnly={readOnly}
                                    icon={param?.choices.find(x => x.key === data?.gesthand_is_health_questionnaire?.toString())?.icon ?? ''}
                                    valueDisplay={param?.choices.find(x => x.key === data?.gesthand_is_health_questionnaire?.toString())?.text ?? ''}
                                    selectedKey={data?.gesthand_is_health_questionnaire?.toString() ?? 'false'}
                                    options={param?.choices}
                                    error={this.state.errorField?.gesthand_is_health_questionnaire?.errors?.[0]}
                                    onChange={(ev, item) => this.setState({ data: { ...this.state.data, gesthand_is_health_questionnaire: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <div className="flex-row flex-start">
                                    <Label htmlFor="gesthand_certificate_date">Date du certificat médical</Label>
                                    <TooltipHost
                                        content="Format attendu: JJ/MM/AAAA"
                                        directionalHint={DirectionalHint.bottomCenter}
                                        delay={TooltipDelay.zero}
                                    >
                                        <Icon iconName="Info" className="icon-info-label is-not-required" />
                                    </TooltipHost>
                                </div>
                                <MaskedTextField
                                    id="gesthand_certificate_date"
                                    value={stringToCleanString(data?.gesthand_certificate_date)}
                                    mask={"99/99/9999"}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, gesthand_certificate_date: stringToDate(ev.target.value) } })}
                                    errorMessage={this.state.errorField?.gesthand_certificate_date?.errors?.[0]}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <div className="flex-row flex-start">
                                    <Label htmlFor="gesthand_qualification_date">Date de qualification</Label>
                                    <TooltipHost
                                        content="Format attendu: JJ/MM/AAAA"
                                        directionalHint={DirectionalHint.bottomCenter}
                                        delay={TooltipDelay.zero}
                                    >
                                        <Icon iconName="Info" className="icon-info-label is-not-required" />
                                    </TooltipHost>
                                </div>
                                <MaskedTextField
                                    id="gesthand_qualification_date"
                                    value={stringToCleanString(data?.gesthand_qualification_date)}
                                    mask={"99/99/9999"}
                                    borderless={readOnly}
                                    readOnly={readOnly}
                                    onBlur={ev => this.setState({ data: { ...this.state.data, gesthand_qualification_date: stringToDate(ev.target.value) } })}
                                    errorMessage={this.state.errorField?.gesthand_qualification_date?.errors?.[0]}
                                />
                            </Columns.Column>
                        </Columns>

                    </div>
                    <br />
                    <div className="card" >
                        <Text variant="large" block><Icon iconName='FabricUserFolder' /> Document(s)</Text>
                        <Divider />
                        <Columns>
                            <Columns.Column>
                                <Label required>Certificat médical</Label>
                                <FileInput
                                    isRead={readOnly}
                                    errorMessage={this.state.errorField?.documentFile1?.errors?.[0]}
                                    isFile={!!data?.documents?.find(doc => doc?.category?.id === 1)?.document}
                                    isDisabled={!this.props.match?.params?.id}
                                    fileName={data?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name}
                                    onDownload={() => {
                                        return request.getDocument(this.props.match?.params?.id, 1)
                                            .then(file => dlBlob(file, data?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}
                                    onOpen={() => {
                                        return request.getDocument(this.props.match?.params?.id, 1)
                                            .then(file => openBlob(file, data?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}
                                    onUpload={file => {
                                        return request.uploadDocument(file, this.props.match?.params?.id, 1)
                                            .then(doc => {
                                                let documents = [...data.documents]
                                                documents.push(doc)
                                                this.setState({ data: { ...this.state.data, documents: documents }, errorField: {} })
                                            })
                                            .catch(err => {
                                                this.props.setMessageBar(true, MessageBarType.error, err)
                                                this.setState({ errorField: { ...this.state.errorField, documentFile1: err?.form?.children?.documentFile } })
                                            })
                                    }}
                                    onDelete={() => {
                                        return request.deleteDocument(this.props.match?.params?.id, 1)
                                            .then(() => {
                                                let documents = [...data.documents]
                                                const currIndex = documents?.findIndex(doc => doc?.category?.id === 1)
                                                if (currIndex > -1) documents.splice(currIndex, 1)
                                                this.setState({ data: { ...this.state.data, documents: documents }, errorField: {} })
                                            })
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}
                                />
                            </Columns.Column>

                            {
                                data?.is_reduced_price &&
                                <Columns.Column>
                                    <Label required>Jusitificatif étudiant/chomage</Label>
                                    <FileInput
                                        isRead={readOnly}
                                        errorMessage={this.state.errorField?.documentFile2?.errors?.[0]}
                                        isFile={!!data?.documents?.find(doc => doc?.category?.id === 2)?.document}
                                        isDisabled={!this.props.match?.params?.id}
                                        fileName={data?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name}
                                        onDownload={() => {
                                            return request.getDocument(this.props.match?.params?.id, 2)
                                                .then(file => dlBlob(file, data?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                                .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                        }}
                                        onOpen={() => {
                                            return request.getDocument(this.props.match?.params?.id, 2)
                                                .then(file => openBlob(file, data?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                                .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                        }}
                                        onUpload={file => {
                                            return request.uploadDocument(file, this.props.match?.params?.id, 2)
                                                .then(doc => {
                                                    let documents = [...data.documents]
                                                    documents.push(doc)
                                                    this.setState({ data: { ...this.state.data, documents: documents }, errorField: {} })
                                                })
                                                .catch(err => {
                                                    this.props.setMessageBar(true, MessageBarType.error, err)
                                                    this.setState({ errorField: { ...this.state.errorField, documentFile2: err?.form?.children?.documentFile } })
                                                })
                                        }}
                                        onDelete={() => {
                                            return request.deleteDocument(this.props.match?.params?.id, 2)
                                                .then(() => {
                                                    let documents = [...data.documents]
                                                    const currIndex = documents?.findIndex(doc => doc?.category?.id === 2)
                                                    if (currIndex > -1) documents.splice(currIndex, 1)
                                                    this.setState({ data: { ...this.state.data, documents: documents }, errorField: {} })
                                                })
                                                .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                        }}
                                    />
                                </Columns.Column>
                            }

                            <Columns.Column>
                                <Label>Attestation</Label>
                                <FileInput
                                    isRead={true}
                                    isFile={!!readOnly}
                                    isDisabled={!data.is_payed || !data.is_inscription_done}
                                    tooltipContent={!data.is_payed || !data.is_inscription_done ? "Document téléchargeable une fois l'inscription finalisée et validée par le club." : ''}
                                    onDownload={() => {
                                        return request.getAttestation(this.props.match?.params?.id)
                                            .then(file => dlBlob(file, `Attestation_paiement_cotisation_${data?.firstname?.charAt(0).toUpperCase()}${data?.firstname?.slice(1)}_${data?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}
                                    onOpen={() => {
                                        return request.getAttestation(this.props.match?.params?.id)
                                            .then(file => openBlob(file, `Attestation_paiement_cotisation_${data?.firstname?.charAt(0).toUpperCase()}${data?.firstname?.slice(1)}_${data?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}
                                />
                            </Columns.Column>

                            <Columns.Column>
                                <Label>Lettre de non-opposition</Label>
                                <DefaultButton
                                    text="Télécharger"
                                    iconProps={{ iconName: 'Download' }}
                                    disabled={!readOnly}
                                    onClick={() => this.setState({ isModalNonObjectionOpen: true })}
                                />
                            </Columns.Column>
                            {!data?.is_reduced_price && <Columns.Column className="is-hidden-touch" />}
                        </Columns>
                    </div>
                    <br />
                    <div className="card" >
                        <Text variant="large" block><Icon iconName='WebAppBuilderFragment' /> Autre</Text>
                        <Divider />
                        <Columns>
                            <Columns.Column>
                                <Label htmlFor="notes">Notes</Label>
                                <TextField
                                    id="notes"
                                    placeholder="Notes"
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
                <Dialog
                    hidden={!this.state.isModalNonObjectionOpen}
                    onDismiss={() => this.setState({ isModalNonObjectionOpen: false })}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        closeButtonAriaLabel: 'Close',
                        title: "Informations requises",
                        subText: "Veuillez remplir les informations suivantes pour générer le fichier."
                    }}
                    modalProps={{
                        isBlocking: true,
                        styles: { main: { maxWidth: 450 } },
                        dragOptions: false
                    }}
                >
                    <Label required htmlFor="club">Nom du club destinataire</Label>
                    <TextField
                        id="club"
                        placeholder="Club"
                        defaultValue={nonObjection.club}
                        onBlur={ev => this.setState({ nonObjection: { ...this.state.nonObjection, club: ev.target.value } })}
                    />
                    <br />
                    <Label required htmlFor="address">Adresse du club destinataire</Label>
                    <TextField
                        id="address"
                        placeholder="Adresse"
                        multiline
                        autoAdjustHeight
                        defaultValue={nonObjection.address}
                        onBlur={ev => this.setState({ nonObjection: { ...this.state.nonObjection, address: ev.target.value } })}
                    />
                    <br />
                    <DialogFooter styles={{ actionsRight: { display: 'flex', justifyContent: "flex-end" } }}>
                        <DefaultButton
                            onClick={() => this.setState({ isModalNonObjectionOpen: false })}
                            text="Annuler"
                        />
                        <FileInput
                            isRead={true}
                            isFile={!!readOnly}
                            isDisabled={!nonObjection.address || !nonObjection.club}
                            onDownload={() => {
                                return request.getNonObjection(this.props.match?.params?.id, nonObjection)
                                    .then(file => this.setState({ isModalNonObjectionOpen: false }, () => dlBlob(file, `Lettre_non_opposition_${data?.firstname?.charAt(0).toUpperCase()}${data?.firstname?.slice(1)}_${data?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`)))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                            onOpen={() => {
                                return request.getNonObjection(this.props.match?.params?.id, nonObjection)
                                    .then(file => openBlob(file, `Lettre_non_opposition_${data?.firstname?.charAt(0).toUpperCase()}${data?.firstname?.slice(1)}_${data?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                        />
                    </DialogFooter>
                </Dialog>
            </>
        )
    }

    showModalDetailPrice(position, price) {
        let deadlineDate = new Date(this.props.param?.price?.global?.deadline_date)
        let deadlineDateAfter = (new Date(deadlineDate.getTime()))
        deadlineDateAfter.setDate(deadlineDate.getDate() + 1)

        this.props.setModal(
            true,
            'Détail du tarif',
            <>Ensemble des informations tarifaires, <span className="is-underline">uniquement valable</span> pour la saison actuelle <span className="is-underline">({this.props.param?.season?.find(x => x.is_current)?.label})</span></>,
            undefined,
            <>
                <Text variant="large" block><Icon iconName='NumberedList' /> Tarifs</Text>
                <Divider />
                <Table>
                    <thead>
                        <tr>
                            <th>Année de naissance</th>
                            {
                                deadlineDate >= new Date()
                                    ?
                                    <>
                                        <th>Tarifs jusqu'au {dateToCleanDateString(deadlineDate)}</th>
                                        <th>Tarifs à partir {dateToCleanDateString(deadlineDateAfter)}</th>
                                    </>
                                    :
                                    <>
                                        <th>Tarifs à partir {dateToCleanDateString(deadlineDateAfter)}</th>
                                        <th>Tarifs jusqu'au {dateToCleanDateString(deadlineDate)}</th>
                                    </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.param?.price?.license?.map((el, i) => {
                            let currInterval = !this.state.data?.is_reduced_price && el.min_year <= getYear(this.state.data?.birthdate) && el.max_year >= getYear(this.state.data?.birthdate)
                            return (
                                <tr key={i} >
                                    <td className={currInterval ? 'is-selected' : ''} >{el.label}</td>
                                    {
                                        deadlineDate >= new Date()
                                            ?
                                            <>
                                                <td className={deadlineDate >= new Date() && currInterval ? 'is-selected' : ''}>{el.price_before_deadline} €</td>
                                                <td className={deadlineDate < new Date() && currInterval ? 'is-selected' : ''}>{el.price_after_deadline} €</td>
                                            </>
                                            :
                                            <>
                                                <td className={deadlineDate < new Date() && currInterval ? 'is-selected' : ''}>{el.price_after_deadline} €</td>
                                                <td className={deadlineDate >= new Date() && currInterval ? 'is-selected' : ''}>{el.price_before_deadline} €</td>
                                            </>
                                    }
                                </tr>
                            )
                        })}
                        <tr>
                            <td className={this.state.data?.is_reduced_price ? 'is-selected' : ''} >
                                Loisirs - Etudiants - Chômeurs
                            </td>
                            {
                                deadlineDate >= new Date()
                                    ?
                                    <>
                                        <td className={deadlineDate >= new Date() && this.state.data?.is_reduced_price ? 'is-selected' : ''}>
                                            {this.props.param?.price?.global?.reduced_price_before_deadline} €
                                        </td>
                                        <td className={deadlineDate < new Date() && this.state.data?.is_reduced_price ? 'is-selected' : ''}>
                                            {this.props.param?.price?.global?.reduced_price_after_deadline} €
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td className={deadlineDate < new Date() && this.state.data?.is_reduced_price ? 'is-selected' : ''}>
                                            {this.props.param?.price?.global?.reduced_price_after_deadline} €
                                        </td>
                                        <td className={deadlineDate >= new Date() && this.state.data?.is_reduced_price ? 'is-selected' : ''}>
                                            {this.props.param?.price?.global?.reduced_price_before_deadline} €
                                        </td>
                                    </>
                            }
                        </tr>
                    </tbody>
                </Table>
                {
                    this.state.data?.is_transfer_needed &&
                    <>
                        <br />
                        <Text variant="large" block ><Icon iconName='NumberedList' /> Droits de mutation à la charge du nouveau licensié (coût ligue)</Text>
                        <Divider />
                        <Table>
                            <thead>
                                <tr>
                                    <th>Age</th>
                                    <th>Prix</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.param?.price?.transfer?.map((el, i) => {
                                    let currInterval = this.state.data?.is_transfer_needed && el.min_age <= getAge(this.state.data?.birthdate) && el.max_age >= getAge(this.state.data?.birthdate)
                                    return (
                                        <tr key={i} className={currInterval ? 'is-selected' : ''} >
                                            <td>{el.label}</td>
                                            <td>{el.price} €</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </>
                }
                <br />
                <Text variant="large" block ><Icon iconName='NumberedList' /> Hand en famille</Text>
                <Divider />
                <Table>
                    <thead>
                        <tr>
                            <th>Licence</th>
                            <th>Réduction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.param?.price?.discount?.map((el, i) => {
                            let currInterval = i === position
                            return (
                                <tr key={i} className={currInterval ? 'is-selected' : ''} >
                                    <td>{el.number}<sup>è</sup> license</td>
                                    <td>-{el.discount} €</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                {
                    this.state.data?.payment_solution?.id === 1 &&
                    <>
                        <br />
                        <Text variant="large" block ><Icon iconName='PaymentCard' /> Frais PayPal: <b>{this.props.param?.price?.global?.paypal_fee} €</b></Text>
                        <Divider />
                        <Columns>
                            <Columns.Column>
                                <TextField
                                    label="Numéro du paiement"
                                    placeholder="Numéro du paiement"
                                    defaultValue={this.state.data?.paypal_information?.id_payment}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <TextField
                                    label="Date"
                                    placeholder="Date"
                                    defaultValue={dateToCleanDateTimeString(new Date(this.state.data?.paypal_information?.creation_datetime))}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                        </Columns>
                        <Columns>
                            <Columns.Column>
                                <TextField
                                    label="Montant"
                                    placeholder="Montant"
                                    defaultValue={this.state.data?.paypal_information?.amount}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <TextField
                                    label="Devise"
                                    placeholder="Devise"
                                    defaultValue={this.state.data?.paypal_information?.currency}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                        </Columns>
                        <Columns>
                            <Columns.Column>
                                <TextField
                                    label="Prénom"
                                    placeholder="Prénom"
                                    defaultValue={this.state.data?.paypal_information?.firstname}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                            <Columns.Column>
                                <TextField
                                    label="Nom"
                                    placeholder="Nom"
                                    defaultValue={this.state.data?.paypal_information?.lastname}
                                    borderless={true}
                                    readOnly={true}
                                />
                            </Columns.Column>
                        </Columns>
                        <TextField
                            label="Email"
                            placeholder="Email"
                            defaultValue={this.state.data?.paypal_information?.email}
                            borderless={true}
                            readOnly={true}
                        />
                    </>
                }
                <br />
                <Text variant="large" block ><Icon iconName='NumberSymbol' /> Total à payer pour ce membre: <b>{this.state.data?.payment_solution?.id === 1 ? (price + 5) : price} €</b></Text>
                <Divider />
                <br />
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: data => dispatch(setBreadcrumb(data)),
        setCommand: data => dispatch(setCommand(data)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
        setModal: (show, title, subTitle, callback, content) => dispatch(setModal(show, title, subTitle, callback, content)),
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
