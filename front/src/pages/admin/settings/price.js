import React from 'react'
import { Columns, Table } from 'react-bulma-components'
import { Label, TextField, IconButton, MaskedTextField, Icon, Text, Dropdown, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setModal } from 'redux/actions/common'
import { stringToCleanString, stringToDate } from 'helper/date'
import Divider from 'component/divider'
import { history } from 'helper/history'
import request from 'helper/request'
import Loader from 'component/loader'

class _SettingsPrice extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            initData: { ...this.props?.param?.price },
            data: { ...this.props?.param?.price },
            seasonIdSelected: this.props.param?.season?.find(x => x.is_current)?.id,
            errorField: {
                global: {},
                license: {},
                transfer: {},
                discount: {},
            }
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les paramètres', key: 'settings', onClick: () => history.push('/parametres') },
            { text: 'Tarif', key: 'settings-price', isCurrentItem: true },
        ])

        this.commandEdit = [
            {
                key: 'saveItem',
                text: 'Enregistrer',
                iconProps: { iconName: 'Save' },
                onClick: () => {
                    this.props.setCommand([])
                    this.setState({ isLoading: true },
                        () => request.putParamPriceBySeason(this.state.seasonIdSelected, this.state.data)
                            .then(data => {                                
                                this.props.setMessageBar(true, MessageBarType.success, <>L'élément à bien été mise à jour. Veuillez actualiser l'application en cliquant sur le bouton " <Icon iconName='Refresh' /> " en haut à droite de l'interface.</>)
                                this.setState({
                                    data,
                                    initData: data,
                                    errorField: { global: {}, license: {}, transfer: {}, discount: {} }
                                })
                            })
                            .catch(err => {
                                this.props.setMessageBar(true, MessageBarType.error, err)
                                this.setState({
                                    errorField: {
                                        global: err?.global?.form?.children,
                                        license: err?.license?.form?.children,
                                        transfer: err?.transfer?.form?.children,
                                        discount: err?.discount?.form?.children,
                                    }
                                })
                            })
                            .finally(() => {
                                this.setState({ isLoading: false })
                                this.props.setCommand(this.commandEdit)
                            })
                    )
                    //dateToString
                    // console.log(this.state.data)
                    // console.log(this.state.seasonIdSelected)
                },
                disabled: this.state.isLoading
            },
            {
                key: 'import',
                text: 'Importer',
                iconProps: { iconName: 'Copy' },
                onClick: () => {
                    this.props.setModal(
                        true,
                        'Importer les informations tarifaires',
                        <span>
                            Êtes-vous certains de vouloir importer les informations tarifaires pour la saison <u>{this.props.param?.season?.find(x => x.id === this.state.seasonIdSelected)?.label}</u> depuis la saison en cours (<u>{this.props.param?.season?.find(x => x.is_current)?.label}</u>) ?
                        </span>,
                        () => {
                            const newData = { ...this.state.initData }
                            newData.global.id = null
                            newData.global.season = null
                            newData.license = newData?.license?.map(x => { return { ...x, id: null, season: null } })
                            newData.transfer = newData?.transfer?.map(x => { return { ...x, id: null, season: null } })
                            newData.discount = newData?.discount?.map(x => { return { ...x, id: null, season: null } })

                            this.setState({ data: newData, isLoading: true }, () => this.setState({ isLoading: false }))
                        }
                    )
                },
                disabled: true
            }
        ]

        this.props.setCommand(this.commandEdit)
    }

    getValues() {

    }

    render() {
        const { data, seasonIdSelected, isLoading, errorField } = this.state
        const { param } = this.props

        return (
            <section id="admin-settings">
                <div className="card" >
                    <Text variant="large" block><Icon iconName='Money' /> Tarifs</Text>
                    <Divider />
                    <Text className="has-text-danger">
                        Veillez à saisir correctement les informations pour que les calculs tarifaires puissent être effectués correctement pour l'inscription des membres.
                    </Text>
                    <br />
                    <br />
                    <Columns>
                        <Columns.Column>
                            <Label htmlFor="season">Saison affichée</Label>
                            <Dropdown
                                id="season"
                                options={[...param?.season]?.map(x => { return { key: x.id, text: x.label } })}
                                selectedKey={seasonIdSelected}
                                disabled={isLoading}
                                onChange={(ev, item) => {
                                    this.props.setCommand([])
                                    this.setState({ seasonIdSelected: item.key, isLoading: true },
                                        () => request.getParamPriceBySeason(item.key)
                                            .then(data => {
                                                this.setState({ data, errorField: { global: {}, license: {}, transfer: {}, discount: {} } })
                                            })
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                            .finally(() => {
                                                this.setState({ isLoading: false })
                                                this.commandEdit[1].disabled = (this.state.seasonIdSelected === this.props.param?.season?.find(x => x.is_current)?.id)
                                                this.props.setCommand(this.commandEdit)
                                            })
                                    )
                                }}
                            />
                        </Columns.Column>
                        <Columns.Column className="is-hidden-touch" />
                        <Columns.Column className="is-hidden-touch" />
                        <Columns.Column className="is-hidden-touch" />
                    </Columns>
                </div>
                <br />

                {
                    isLoading ?
                        <Loader />
                        :
                        <>
                            <div className="card" >
                                <Text variant="large" block><Icon iconName='Tag' /> Global</Text>
                                <Divider />
                                <Columns>
                                    <Columns.Column>
                                        <Label htmlFor="deadline_date">Deadline inscription</Label>
                                        <MaskedTextField
                                            id="deadline_date"
                                            value={stringToCleanString(data.global?.deadline_date)}
                                            mask={"99/99/9999"}
                                            onBlur={ev => this.setState({ data: { ...this.state.data, global: { ...this.state.data.global, deadline_date: stringToDate(ev.target.value) } } })}
                                            errorMessage={errorField?.global?.deadline_date?.errors?.[0]}
                                            description="Date limite incluse pour l'inscription à prix réduit"
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label htmlFor="reduced_price_before_deadline">Tarif réduit avant deadline</Label>
                                        <TextField
                                            id="reduced_price_before_deadline"
                                            defaultValue={!isNaN(data.global?.reduced_price_before_deadline) ? (data.global?.reduced_price_before_deadline ?? '') : ''}
                                            suffix="€"
                                            onKeyPress={ev => {
                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                    ev.preventDefault()
                                            }}
                                            styles={{ root: { width: '100%' } }}
                                            onBlur={ev => this.setState({ data: { ...this.state.data, global: { ...this.state.data.global, reduced_price_before_deadline: parseInt(ev.target.value) } } })}
                                            errorMessage={errorField?.global?.reduced_price_before_deadline?.errors?.[0]}
                                            description="Tarif pour loisir/étudiant/chomeur"
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label htmlFor="reduced_price_after_deadline">Tarif réduit après deadline</Label>
                                        <TextField
                                            id="reduced_price_after_deadline"
                                            defaultValue={!isNaN(data.global?.reduced_price_after_deadline) ? (data.global?.reduced_price_after_deadline ?? '') : ''}
                                            suffix="€"
                                            onKeyPress={ev => {
                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                    ev.preventDefault()
                                            }}
                                            styles={{ root: { width: '100%' } }}
                                            onBlur={ev => this.setState({ data: { ...this.state.data, global: { ...this.state.data.global, reduced_price_after_deadline: parseInt(ev.target.value) } } })}
                                            errorMessage={errorField?.global?.reduced_price_after_deadline?.errors?.[0]}
                                            description="Tarif pour loisir/étudiant/chomeur"
                                        />
                                    </Columns.Column>
                                    <Columns.Column>
                                        <Label htmlFor="paypal_fee">Frais PayPal</Label>
                                        <TextField
                                            id="paypal_fee"
                                            defaultValue={!isNaN(data.global?.paypal_fee) ? (data.global?.paypal_fee ?? '') : ''}
                                            suffix="€"
                                            onKeyPress={ev => {
                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                    ev.preventDefault()
                                            }}
                                            styles={{ root: { width: '100%' } }}
                                            onBlur={ev => this.setState({ data: { ...this.state.data, global: { ...this.state.data.global, paypal_fee: parseInt(ev.target.value) } } })}
                                            errorMessage={errorField?.global?.paypal_fee?.errors?.[0]}
                                            description="Frais supplémentaire pour les transactions PayPal"
                                        />
                                    </Columns.Column>
                                </Columns>
                            </div>
                            <br />
                            <div className="card" >
                                <div className="flex-row flex-start ">
                                    <Text variant="large" block><Icon iconName='Tag' /> Prix des licenses</Text>
                                    &nbsp;
                                    <IconButton
                                        iconProps={{ iconName: 'Add' }}
                                        onClick={() => {
                                            const newItems = [...this.state.data.license]
                                            const newItem = { ...newItems[0] }
                                            for (const key in newItem) {
                                                newItem[key] = null
                                            }
                                            newItems.push(newItem)
                                            this.setState({ data: { ...this.state.data, license: newItems } })
                                        }}
                                    />
                                </div>
                                <Divider />
                                <Text className="has-text-danger">
                                    Les intervalles d'années de naissance incluent les bornes précisées.
                                </Text>
                                <br />
                                <br />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th><Label>Label</Label></th>
                                            <th><Label>Prix av. deadline</Label></th>
                                            <th><Label>Prix ap. deadline</Label></th>
                                            <th><Label>Année naissance membre min.</Label></th>
                                            <th><Label>Année naissance membre max.</Label></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.license?.map((x, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <TextField
                                                            defaultValue={x.label}
                                                            placeholder="Label"
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.license]
                                                                newItems[i].label = ev.target.value
                                                                this.setState({ data: { ...this.state.data, license: newItems } })
                                                            }}
                                                            errorMessage={errorField?.license?.label?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            defaultValue={!isNaN(x?.price_before_deadline) ? (x?.price_before_deadline ?? '') : ''}
                                                            suffix="€"
                                                            placeholder="Prix av. deadline"
                                                            onKeyPress={ev => {
                                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                                    ev.preventDefault()
                                                            }}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.license]
                                                                newItems[i].price_before_deadline = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, license: newItems } })
                                                            }}
                                                            errorMessage={errorField?.license?.price_before_deadline?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            defaultValue={!isNaN(x?.price_after_deadline) ? (x?.price_after_deadline ?? '') : ''}
                                                            suffix="€"
                                                            placeholder="Prix ap. deadline"
                                                            onKeyPress={ev => {
                                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                                    ev.preventDefault()
                                                            }}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.license]
                                                                newItems[i].price_after_deadline = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, license: newItems } })
                                                            }}
                                                            errorMessage={errorField?.license?.price_after_deadline?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <MaskedTextField
                                                            placeholder="Année min."
                                                            value={x.min_year?.toString() ?? ''}
                                                            mask={"9999"}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.license]
                                                                newItems[i].min_year = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, license: newItems } })
                                                            }}
                                                            errorMessage={errorField?.license?.min_year?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <MaskedTextField
                                                            placeholder="Année max."
                                                            value={x.max_year?.toString() ?? ''}
                                                            mask={"9999"}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.license]
                                                                newItems[i].max_year = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, license: newItems } })
                                                            }}
                                                            errorMessage={errorField?.license?.max_year?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <IconButton
                                                            iconProps={{ iconName: 'Delete' }}
                                                            title="Supprimer"
                                                            disabled={data?.license?.length <= 1}
                                                            onClick={() => {
                                                                const newItems = [...this.state.data.license]
                                                                newItems.splice(i, 1)
                                                                this.setState({ data: { ...this.state.data, license: newItems }, isLoading: true }, () => this.setState({ isLoading: false }))
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <br />
                            <div className="card" >
                                <div className="flex-row flex-start ">
                                    <Text variant="large" block><Icon iconName='Tag' /> Réduction familiale</Text>
                                &nbsp;
                                <IconButton
                                        iconProps={{ iconName: 'Add' }}
                                        onClick={() => {
                                            const newItems = [...this.state.data.discount]
                                            const newItem = { ...newItems[0] }
                                            for (const key in newItem) {
                                                newItem[key] = null
                                            }
                                            newItems.push(newItem)
                                            this.setState({ data: { ...this.state.data, discount: newItems } })
                                        }}
                                    />
                                </div>
                                <Divider />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th><Label>Nombre de membre</Label></th>
                                            <th><Label>Réduction</Label></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.discount?.map((x, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <MaskedTextField
                                                            placeholder="Nombre de membres"
                                                            value={x.number?.toString() ?? ''}
                                                            mask={"9"}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.discount]
                                                                newItems[i].number = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, discount: newItems } })
                                                            }}
                                                            errorMessage={errorField?.discount?.number?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            placeholder="Réduction"
                                                            defaultValue={!isNaN(x?.discount) ? (x?.discount ?? '') : ''}
                                                            suffix="€"
                                                            onKeyPress={ev => {
                                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                                    ev.preventDefault()
                                                            }}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.discount]
                                                                newItems[i].discount = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, discount: newItems } })
                                                            }}
                                                            errorMessage={errorField?.discount?.discount?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <IconButton
                                                            iconProps={{ iconName: 'Delete' }}
                                                            title="Supprimer"
                                                            disabled={data?.discount?.length <= 1}
                                                            onClick={() => {
                                                                const newItems = [...this.state.data.discount]
                                                                newItems.splice(i, 1)
                                                                this.setState({ data: { ...this.state.data, discount: newItems } })
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <br />
                            <div className="card" >
                                <div className="flex-row flex-start ">
                                    <Text variant="large" block><Icon iconName='Tag' /> Prix des transferts</Text>
                                &nbsp;
                                <IconButton
                                        iconProps={{ iconName: 'Add' }}
                                        onClick={() => {
                                            const newItems = [...this.state.data.transfer]
                                            const newItem = { ...newItems[0] }
                                            for (const key in newItem) {
                                                newItem[key] = null
                                            }
                                            newItems.push(newItem)
                                            this.setState({ data: { ...this.state.data, transfer: newItems }, isLoading: true }, () => this.setState({ isLoading: false }))
                                        }}
                                    />
                                </div>
                                <Divider />
                                <Text className="has-text-danger">
                                    Les intervalles d'âges incluent les bornes précisées.
                                </Text>
                                <br />
                                <br />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th><Label>Label</Label></th>
                                            <th><Label>Prix</Label></th>
                                            <th><Label>Age du membre min.</Label></th>
                                            <th><Label>Age du membre max.</Label></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.transfer?.map((x, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <TextField
                                                            placeholder="Label"
                                                            defaultValue={x.label}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.transfer]
                                                                newItems[i].label = ev.target.value
                                                                this.setState({ data: { ...this.state.data, transfer: newItems } })
                                                            }}
                                                            errorMessage={errorField?.transfer?.label?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            placeholder="Prix"
                                                            defaultValue={x.price}
                                                            suffix="€"
                                                            onKeyPress={ev => {
                                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                                    ev.preventDefault()
                                                            }}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.transfer]
                                                                newItems[i].price = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, transfer: newItems } })
                                                            }}
                                                            errorMessage={errorField?.transfer?.price?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            placeholder="Age min."
                                                            defaultValue={x.min_age}
                                                            onKeyPress={ev => {
                                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                                    ev.preventDefault()
                                                            }}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.transfer]
                                                                newItems[i].min_age = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, transfer: newItems } })
                                                            }}
                                                            errorMessage={errorField?.transfer?.min_age?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            placeholder="Age max."
                                                            defaultValue={x.max_age}
                                                            onKeyPress={ev => {
                                                                ((ev.key.length === 1 && !('0123456789.,'.indexOf(ev.key) > -1)) ||
                                                                    ((ev.key === '.' || ev.key === ',') && ((ev.target.value.indexOf('.') > -1) || (ev.target.value.indexOf(',') > -1)))) &&
                                                                    ev.preventDefault()
                                                            }}
                                                            onBlur={ev => {
                                                                const newItems = [...this.state.data.transfer]
                                                                newItems[i].max_age = parseInt(ev.target.value)
                                                                this.setState({ data: { ...this.state.data, transfer: newItems } })
                                                            }}
                                                            errorMessage={errorField?.transfer?.max_age?.errors?.[0]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <IconButton
                                                            iconProps={{ iconName: 'Delete' }}
                                                            title="Supprimer"
                                                            disabled={data?.transfer?.length <= 1}
                                                            onClick={() => {
                                                                const newItems = [...this.state.data.transfer]
                                                                newItems.splice(i, 1)
                                                                console.log(newItems)
                                                                this.setState({ data: { ...this.state.data, transfer: newItems }, isLoading: true }, () => this.setState({ isLoading: false }))
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div >
                        </>
                }
            </section >
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
const SettingsPrice = connect(mapStateToProps, mapDispatchToProps)(_SettingsPrice)
export default SettingsPrice
