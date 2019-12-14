import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'office-ui-fabric-react'

class _Workflow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                {
                    isCompleted: true,
                    isActive: !this.props.member.is_document_complete,
                    icon: <Icon iconName="CheckMark" />,
                    label: this.props.param?.workflowStep?.find(x => x.id === 1)?.label,
                    description: 'L\'utilisateur est créé.'
                },
                {
                    isCompleted: this.props.member.is_document_complete,
                    isActive: true && !this.props.member.is_payed,
                    icon: '',
                    label: this.props.param?.workflowStep?.find(x => x.id === 2)?.label,
                    description: 'L\'utilisateur à fournis les documents nécessaires.'
                },
                {
                    isCompleted: this.props.member.is_payed,
                    isActive: this.props.member.is_document_complete && !this.props.member.is_check_gest_hand,
                    icon: '',
                    label: this.props.param?.workflowStep?.find(x => x.id === 3)?.label,
                    description: 'L\'utilisateur à payé.'
                },
                {
                    isCompleted: this.props.member.is_check_gest_hand,
                    isActive: this.props.member.is_payed && !this.props.member.is_inscription_done,
                    icon: '',
                    label: this.props.param?.workflowStep?.find(x => x.id === 4)?.label,
                    description: 'L\'utilisateur est bien inscris sur Gest\'hand.'
                },
                {
                    isCompleted: this.props.member.is_inscription_done,
                    isActive: this.props.member.is_check_gest_hand && !this.props.member.is_inscription_done,
                    icon: '',
                    label: this.props.param?.workflowStep?.find(x => x.id === 5)?.label,
                    description: 'L\'inscription est finalisée.'
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
                            <div key={i} className={`step-item ${row.isCompleted ? 'is-completed' : ''} ${row.isActive ? 'is-active' : ''} `}>
                                <div className="step-marker">
                                    {(() => {
                                        if (row.isCompleted) {
                                            return <Icon iconName="CheckMark" />
                                        } else if (row.isActive) {
                                            return <Icon iconName="Play" />
                                        } else {
                                            return <Icon iconName="More" />
                                        }
                                    })()}
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

const mapDispatchToProps = dispatch => {
    return {}
}

const mapStateToProps = state => {
    return {
        param: state.user.param
    }
}
const Workflow = connect(mapStateToProps, mapDispatchToProps)(_Workflow)
export default Workflow
