import React from 'react'
import { Icon } from 'office-ui-fabric-react'
import PropTypes from 'prop-types'

export default class Workflow extends React.Component {
    static propTypes = {
        /** Data to display */ 
        data: PropTypes.arrayOf(PropTypes.object),
    }

    static defaultProps = {
        data: [],
    }


    render() {
        if (!this.props?.data || !this.props?.data?.length) return <p>Impossible d'afficher le workflow...</p>
        return (
            <div className={`steps ${this.props?.className ?? ''}`}>
                {
                    this.props?.data?.map((row, i) => {
                        let cn = ""
                        if (row.isActive) cn += 'is-active '
                        if (row.isCompleted) cn += 'is-completed '
                        if (row.isError) cn += 'is-completed is-warning '
                        return (
                            <div key={i} className={`step-item ${cn}`}>
                                <div className="step-marker">
                                    {(() => {
                                        if (row.isCompleted) {
                                            return <Icon iconName="CheckMark" />
                                        } else if (row.isActive) {
                                            return <Icon iconName="ProgressRingDots" />
                                        } else if (row.isError) {
                                            return "!"
                                        } else {
                                            return <Icon iconName="More" />
                                        }
                                    })()}
                                </div>
                                <div className="step-details">
                                    <p className="step-title">{row.label}</p>
                                    <p className="is-hidden-touch">{row.description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
