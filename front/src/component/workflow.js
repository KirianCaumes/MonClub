import React from 'react'
import { Icon, TooltipHost, DirectionalHint, TooltipDelay } from 'office-ui-fabric-react'
import PropTypes from 'prop-types'

export default class Workflow extends React.PureComponent {
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
                                    <TooltipHost
                                        content={row.message}
                                        directionalHint={DirectionalHint.topCenter}
                                        delay={TooltipDelay.zero}
                                    >
                                        {(() => {
                                            if (row.isError) {
                                                return <Icon iconName="Exclamation" className={row.message ? 'info' : ''} />
                                            } else if (row.isCompleted) {
                                                return <Icon iconName="CheckMark" className={row.message ? 'info' : ''} />
                                            } else if (row.isActive) {
                                                return <Icon iconName="ProgressRingDots" className={row.message ? 'info' : ''} />
                                            } else {
                                                return <Icon iconName="More" className={row.message ? 'info' : ''} />
                                            }
                                        })()}
                                    </TooltipHost>
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
