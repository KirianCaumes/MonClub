import React from 'react'
import { } from 'react-bulma-components'
import { Separator, Label, DetailsList, SelectionMode } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'

class _Constants extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les constantes', key: 'constants', isCurrentItem: true },
        ])
        this.props.setCommand([])
    }

    render() {
        const { param } = this.props
        return (
            <section>
                <div className="card" >
                    <Label>Équipe :</Label>
                    <DetailsList
                        items={param?.teams ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    <Label>Étape workflow :</Label>
                    <DetailsList
                        items={param?.workflowStep ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    <Label>Équipe :</Label>
                    <DetailsList
                        items={param?.teams ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    <Label>Glboal :</Label>
                    <DetailsList
                        items={param?.global ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'value',
                                name: 'Valeur',
                                fieldName: 'value',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    <Label>Catégories documents :</Label>
                    <DetailsList
                        items={param?.documentCategory ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    <Label>Prix licences :</Label>
                    <DetailsList
                        items={param?.price?.license ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'price_before_deadline',
                                name: 'Prix avant deadline',
                                fieldName: 'price_before_deadline',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'price_after_deadline',
                                name: 'Prix après deadline',
                                fieldName: 'price_after_deadline',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'min_year',
                                name: 'Année min.',
                                fieldName: 'min_year',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'max_year',
                                name: 'Année max.',
                                fieldName: 'max_year',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    
                    <Label>Prix transfert :</Label>
                    <DetailsList
                        items={param?.price?.transfer ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'label',
                                name: 'Label',
                                fieldName: 'label',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'price',
                                name: 'Prix',
                                fieldName: 'price',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'min_age',
                                name: 'Age min.',
                                fieldName: 'min_age',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'max_age',
                                name: 'Age max.',
                                fieldName: 'max_age',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />
                    
                    <Label>Prix réduction :</Label>
                    <DetailsList
                        items={param?.price?.discount ?? []}
                        columns={[
                            {
                                key: 'id',
                                name: 'Id',
                                fieldName: 'id',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'number',
                                name: 'Nombre',
                                fieldName: 'number',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            },
                            {
                                key: 'discount',
                                name: 'Réduction',
                                fieldName: 'discount',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <Separator />

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
const Constants = connect(mapStateToProps, mapDispatchToProps)(_Constants)
export default Constants
