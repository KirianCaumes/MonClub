import React from 'react'
import { Columns } from 'react-bulma-components'
import { Icon, ShimmeredDetailsList, MessageBarType, SelectionMode, Separator, TextField, DefaultButton, Label, Dropdown, Text, VirtualizedComboBox } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import getWf from 'helper/getStepWf'
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from 'helper/constants'
import ParentPage from 'pages/_parentPage'
import { dlBlob } from 'helper/blob'
import { stringToCleanString } from 'helper/date'

class _MembersAll extends ParentPage {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: [],
            searchParms: {
                name: '',
                stepsId: [],
                teamsId: [],
                seasonId: props.param?.season?.find(x => x.is_current)?.id,
                userId: '',
            },
            columns: [
                {
                    key: 'lastname',
                    name: 'Nom',
                    fieldName: 'lastname',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    isSorted: true,
                    isSortedDescending: false,
                    onRender: member => <span className="is-capitalized">{member.lastname}</span>
                },
                {
                    key: 'firstname',
                    name: 'Prénom',
                    fieldName: 'firstname',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: member => <span className="is-capitalized">{member.firstname}</span>
                },
                {
                    key: 'step',
                    name: 'Étape',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: member => <span className="is-capitalized">{getWf(member)}</span>
                },
                {
                    key: 'team',
                    name: 'Équipe(s)',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: member => <span className="is-capitalized">{member.teams?.map(team => team.label)?.join(', ')}</span>
                },
                {
                    key: 'user',
                    name: 'Utilisateur',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: member => <span className="is-capitalized">{member.user?.username}</span>
                }
            ]
        }
    }

    componentWillUnmount() {
        if (this.fetchGetGoogleContact) this.fetchGetGoogleContact.cancel()
        if (this.fetchGetExcelTracking) this.fetchGetExcelTracking.cancel()
        if (this.fetchGetExcelGeneral) this.fetchGetExcelGeneral.cancel()
        if (this.fetchGetExcelCalculhand) this.fetchGetExcelCalculhand.cancel()
        if (this.fetchGetAllMembers) this.fetchGetAllMembers.cancel()
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Membres', key: 'members' },
            { text: 'Tous les membres', key: 'all-members', isCurrentItem: true },
        ])

        this.props.setCommand([
            {
                key: 'newItem',
                text: 'Nouveau',
                iconProps: { iconName: 'Add' },
                onClick: () => history.push('/membre/nouveau')
            },
            {
                key: 'export',
                text: 'Export',
                iconProps: { iconName: 'CloudDownload' },
                subMenuProps: {
                    items: [
                        {
                            key: 'getGoogleContact',
                            text: 'Contact Google',
                            iconProps: { iconName: 'TextDocumentShared' },
                            onClick: () => {
                                this.fetchGetGoogleContact = request.getGoogleContact()
                                this.fetchGetGoogleContact
                                    .fetch()
                                    .then(file => dlBlob(file, `export_google_contact-${stringToCleanString(new Date())}.csv`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }
                        },
                        {
                            key: 'getExcelTracking',
                            text: 'Récapitulatif Gest\'Hand',
                            iconProps: { iconName: 'ExcelDocument' },
                            onClick: () => {
                                this.fetchGetExcelTracking = request.getExcelTracking()
                                this.fetchGetExcelTracking
                                    .fetch()
                                    .then(file => dlBlob(file, `export_excel_suivis-${stringToCleanString(new Date())}.xlsx`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }
                        },
                        {
                            key: 'getExcelGeneral',
                            text: 'Récapitulatif des équipes',
                            iconProps: { iconName: 'ExcelDocument' },
                            onClick: () => {
                                this.fetchGetExcelGeneral = request.getExcelGeneral()
                                this.fetchGetExcelGeneral
                                    .fetch()
                                    .then(file => dlBlob(file, `export_excel_informations_generales-${stringToCleanString(new Date())}.xlsx`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }
                        },
                        {
                            key: 'getExcelCalculHand',
                            text: 'Récapitulatif des paiements',
                            iconProps: { iconName: 'ExcelDocument' },
                            onClick: () => {
                                this.fetchGetExcelCalculhand = request.getExcelCalculhand()
                                this.fetchGetExcelCalculhand
                                    .fetch()
                                    .then(file => dlBlob(file, `export_excel_calculhand-${stringToCleanString(new Date())}.xlsx`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }
                        },
                    ]
                }
            },
        ])

        this.searchMembers()
    }

    searchMembers() {
        this.setState({ isLoading: true }, () => {
            this.fetchGetAllMembers = request.getAllMembers(this.state.searchParms)
            this.fetchGetAllMembers.fetch()
                .then(data => this.setState({ items: data }))
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }

    render() {
        const { isLoading } = this.state

        return (
            <section id="member-all">
                <div className="card" >
                    <div className="head">
                        <h1><Icon iconName='RecruitmentManagement' /> Rechercher parmis l'ensemble des membres</h1>
                    </div>
                    {
                        (this.props?.me?.roles?.includes(ROLE_ADMIN) || this.props?.me?.roles?.includes(ROLE_SUPER_ADMIN)) &&
                        <>
                            <form onSubmit={ev => { ev.preventDefault(); this.searchMembers() }} >
                                <Columns className="search-inputs">
                                    <Columns.Column >
                                        <TextField
                                            label="Nom/Prénom"
                                            placeholder="Nom/Prénom"
                                            disabled={isLoading}
                                            value={this.state.searchParms.name}
                                            onChange={ev => this.setState({ searchParms: { ...this.state.searchParms, name: ev.target.value } })}
                                        />
                                    </Columns.Column>
                                    <Columns.Column >
                                        <Dropdown
                                            label="Étape"
                                            placeholder="Étape"
                                            disabled={isLoading}
                                            multiSelect
                                            options={[...this.props.param?.workflowStep]?.map(x => { return { key: x.id, text: x.label } })}
                                            selectedKeys={this.state.searchParms.stepsId}
                                            onChange={(ev, item) => {
                                                const newSelectedItems = [...this.state.searchParms.stepsId]
                                                if (item.selected) {
                                                    newSelectedItems.push(item.key)
                                                } else {
                                                    const currIndex = newSelectedItems.indexOf(item.key)
                                                    if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                                }
                                                this.setState({ searchParms: { ...this.state.searchParms, stepsId: newSelectedItems } })
                                            }}
                                        />
                                    </Columns.Column>
                                    <Columns.Column >
                                        <Dropdown
                                            label="Équipe"
                                            placeholder="Équipe"
                                            disabled={isLoading}
                                            multiSelect
                                            options={[...this.props.param?.teams]?.map(x => { return { key: x.id, text: x.label } })}
                                            selectedKeys={this.state.searchParms.teamsId}
                                            onChange={(ev, item) => {
                                                const newSelectedItems = [...this.state.searchParms.teamsId]
                                                if (item.selected) {
                                                    newSelectedItems.push(item.key)
                                                } else {
                                                    const currIndex = newSelectedItems.indexOf(item.key)
                                                    if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                                }
                                                this.setState({ searchParms: { ...this.state.searchParms, teamsId: newSelectedItems } })
                                            }}
                                        />
                                    </Columns.Column>
                                    <Columns.Column >
                                        <VirtualizedComboBox
                                            label="Utilisateur"
                                            placeholder="Utilisateur"
                                            disabled={isLoading}
                                            options={[...this.props.param?.users]?.map(x => { return { key: x.id, text: x.username } })}
                                            selectedKey={this.state.searchParms.userId}
                                            onChange={(ev, item) => this.setState({ searchParms: { ...this.state.searchParms, userId: item.key } })}
                                            useComboBoxAsMenuWidth={true}
                                        />
                                    </Columns.Column>
                                    <Columns.Column >
                                        <Dropdown
                                            label="Saison"
                                            placeholder="Saison"
                                            disabled={isLoading}
                                            options={[...this.props.param?.season]?.filter(x => x.is_active)?.map(x => { return { key: x.id, text: x.label } })}
                                            selectedKey={this.state.searchParms.seasonId}
                                            onChange={(ev, item) => this.setState({ searchParms: { ...this.state.searchParms, seasonId: item.key } })}
                                        />
                                    </Columns.Column>
                                    <Columns.Column >
                                        <Label>&#8203;</Label>
                                        <DefaultButton
                                            text="Rechercher"
                                            primary={true}
                                            split={true}
                                            disabled={isLoading}
                                            onClick={() => this.searchMembers()}
                                            iconProps={{ iconName: 'Search' }}
                                            menuProps={
                                                {
                                                    items: [
                                                        {
                                                            key: 'search',
                                                            text: 'Rechercher',
                                                            iconProps: { iconName: 'Search' },
                                                            onClick: () => this.searchMembers()
                                                        },
                                                        {
                                                            key: 'Clear',
                                                            text: 'Effacer les filtres',
                                                            iconProps: { iconName: 'ClearFilter' },
                                                            onClick: () => this.setState({
                                                                searchParms: {
                                                                    name: '',
                                                                    stepsId: [],
                                                                    teamsId: [],
                                                                    seasonId: this.props.param?.season?.find(x => x.is_current)?.id,
                                                                    userId: ''
                                                                }
                                                            }, () => this.searchMembers())
                                                        }
                                                    ]
                                                }
                                            }
                                        />
                                    </Columns.Column>
                                </Columns>
                            </form>
                            <br />
                            <Separator >
                                <Icon iconName="ChevronDown" />
                            </Separator>
                            <br />
                        </>
                    }
                    <ShimmeredDetailsList
                        items={this.state.items}
                        onActiveItemChanged={item => history.push(`/membre/${item.id}`)}
                        onColumnHeaderClick={this._onColumnClick.bind(this, { colName: "columns", dataName: ['items'], source: "state", action: "", exclude: ['step', 'team', 'user'] })}
                        columns={this.state.columns}
                        selectionMode={SelectionMode.none}
                        enableShimmer={this.state.isLoading}
                    />
                    {this.state.items.length === 0 && !this.state.isLoading && <Text variant="large" className="has-text-centered" block>Aucun résultat</Text>}
                </div >
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
const MembersAll = connect(mapStateToProps, mapDispatchToProps)(_MembersAll)
export default MembersAll
