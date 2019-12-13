import React from 'react'

export default class Workflow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                {
                    isCompleted: true,
                    isActive: false,
                    icon: '',
                    label: 'Créé',
                    description: 'L\'utilisateur est créé.'
                },
                {
                    isCompleted: false,
                    isActive: true,
                    icon: '',
                    label: 'Docments complets',
                    description: 'L\'utilisateur à fournis les documents nécessaires.'
                },
                {
                    isCompleted: false,
                    isActive: false,
                    icon: '',
                    label: 'Payé',
                    description: 'L\'utilisateur à payé.'
                },
                {
                    isCompleted: false,
                    isActive: false,
                    icon: '',
                    label: 'Gest\'hand',
                    description: 'L\'utilisateur est bien inscris sur Gest\'hand.'
                },
                {
                    isCompleted: false,
                    isActive: false,
                    icon: '',
                    label: 'Inscris',
                    description: '\'inscription est finalisée.'
                }
            ]
        }
    }
    render() {
        return (
            <div className="steps">
                {
                    this.state.data.map((row, i) => {
                        return (
                            <div className={`step-item ${row.isCompleted ? 'is-completed' : ''} ${row.isActive ? 'is-active' : ''} `}>
                                <div className="step-marker">
                                    {row.icon}
                                </div>
                                <div className="step-details">
                                    <p className="step-title">{row.label}</p>
                                    <p>{row.description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}