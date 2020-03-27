import React from 'react'
import { } from 'react-bulma-components'
import { Label, DetailsList, SelectionMode } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'

class _Constants extends React.PureComponent {
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
                            },
                            {
                                key: 'label_google_contact',
                                name: 'Label Google Contact',
                                fieldName: 'label_google_contact',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

                    <Label>Étapes workflow :</Label>
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
                    <br />

                    <Label>Global :</Label>
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
                                isMultiline: true
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

                    {/* <Label>Catégories documents :</Label>
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
                    <br /> */}

                    <Label>Rôles :</Label>
                    <DetailsList
                        items={param?.roles ?? []}
                        columns={[
                            {
                                key: 'key',
                                name: 'Clé',
                                fieldName: 'key',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true
                            },
                            {
                                key: 'text',
                                name: 'Texte',
                                fieldName: 'text',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true
                            },
                            {
                                key: 'icon',
                                name: 'Icon',
                                fieldName: 'icon',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

                    <Label>Choix :</Label>
                    <DetailsList
                        items={param?.choices ?? []}
                        columns={[
                            {
                                key: 'key',
                                name: 'Clé',
                                fieldName: 'key',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true
                            },
                            {
                                key: 'text',
                                name: 'Texte',
                                fieldName: 'text',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true
                            },
                            {
                                key: 'icon',
                                name: 'Icon',
                                fieldName: 'icon',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

                    <Label>Sexes :</Label>
                    <DetailsList
                        items={param?.sexes ?? []}
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
                                key: 'icon',
                                name: 'Icon',
                                fieldName: 'icon',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

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
                    <br />


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
                    <br />

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
                    <br />

                    <Label>Moyens de paiements :</Label>
                    <DetailsList
                        items={param?.price?.payment_solution ?? []}
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
                                key: 'icon',
                                name: 'Icône',
                                fieldName: 'icon',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

                    <Label>Saisons :</Label>
                    <DetailsList
                        items={param?.season ?? []}
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
                                key: 'is_active',
                                name: 'Actif',
                                fieldName: 'is_active',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                                onRender: item => <>{item.is_active ? 'Oui' : 'Non'}</>
                            },
                            {
                                key: 'is_current',
                                name: 'En cours',
                                fieldName: 'is_current',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                                onRender: item => <>{item.is_current ? 'Oui' : 'Non'}</>
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

                    <Label>Utilisateurs :</Label>
                    <DetailsList
                        items={param?.users ?? []}
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
                                key: 'username',
                                name: 'Nom',
                                fieldName: 'username',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                    />
                    <br />

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
